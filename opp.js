/**
 * ===========================================
 * @desc 自动生成回滚rollback_dev分支脚本
 * @date 2022-07-29
 * @author wuwangcheng@58.com
 * ===========================================
*/
const fs = require('fs');
const path = require('path');
const simpleGit = require('simple-git');

const git = simpleGit('./');

// 配置文件
const ROLLBACK_BRANCH = {
    local: 'rollback_dev',
    remote: 'origin/rollback_dev'
};

/** @desc 创建回滚分支类 */
class CreateRollBack {
    constructor() {
        this.init();
    }

    /** @desc 初始化函数 */
    init() {
        console.log('===> init...');
        this.run();
    }

    /** @desc 启动函数 */
    async run() {
        try {
            console.log('===> run...');
            // 提交流程
            await this.commit();

            const isExist = await this.exist(ROLLBACK_BRANCH.remote);

            if (isExist) {
                // 如果存在，切换到对应的分支
                await git.checkout(ROLLBACK_BRANCH.local);
            } else {
                // 如果不存在，切换的同时新建分支从origin/master
                await git.checkout(['-b', ROLLBACK_BRANCH.local, 'origin/master']);
            }

            await git.mergeFromTo('origin/master', ROLLBACK_BRANCH.local);

            console.log('===> merge success...');

            await this.commit();

            console.log('===> commit success...');

            await git.checkout(['-']);

            console.log('===> [回滚分支已准备就绪]，返回前一个分支...')
        } catch (err) {
            console.log('err:', err);
        }
    }

    /** @desc 检测某个分支是否存在 */
    async exist(bname) {
        try {
            const res = await git.raw(['branch', '-r']);

            return res.indexOf(bname) > -1;
        } catch (err) {
            return -1;
        }
    }

    /** @desc 提交流程 */
    async commit() {
        try {
            console.log('===> 1.commit start...')
            const status = await git.status();

            const { current } = status;

            await git.add('./*');

            await git.commit(`feat: 分支[${ROLLBACK_BRANCH.local}]自动提交流程`);

            if (current === ROLLBACK_BRANCH.local) {
                console.log('===> start: 1.1放弃本地更改，接受远程修改')
                await git.raw(['fetch', '--all']);
                await git.raw(['reset', '--hard', 'origin/develop']);
                console.log('===> end: 1.2放弃本地更改，接受远程修改')
            }

            await git.pull();

            await git.push('origin', current);

            console.log('===> 2.commit success...')
        } catch (err) {
            console.log('提交流程报错:', err);
        }
    }

    /** @desc 写入代码 */
    async getCode() {
        return `
            const aaa = require('xx');

            aaa.init({
                local:'dev',
                remote: 'dev'
            })
        `
    }

    /** @desc 创建文件 */
    async create() {
        try {
            const filePath = path.join(__dirname, '/test.js');

            const code = await this.getCode();

            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (err) {
                    fs.writeFile('test.js', `${code} `, 'utf8', function (error) {
                        if (error) {
                            console.log('写入失败:', error);
                            return;
                        }
                        console.log('写入成功');
                    })
                }
            });

        } catch (err) {
            console.log('创建文件报错:', err);
        }
    }
}

// 启动
const cb = new CreateRollBack();

//cb.create();