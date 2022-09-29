/**
 * ===========================================
 * @desc 自动生成回滚rollback_dev分支脚本
 * @date 2022-07-29
 * @author wuwangcheng@58.com
 * ===========================================
*/
const simpleGit = require('simple-git');

const git = simpleGit('./');

// 配置文件
let ROLLBACK_BRANCH = {
    local: 'rollback_dev',
    remote: 'origin/rollback_dev',
    mergeFrom: 'origin/master'
};


/** @desc 启动函数 */
const run = async () => {
    try {
        console.log('===> run...');
        // 提交流程
        await commit();

        const isExist = await exist(ROLLBACK_BRANCH.remote);

        if (isExist) {
            // 如果存在，切换到对应的分支
            await git.checkout(ROLLBACK_BRANCH.local);
        } else {
            // 如果不存在，切换的同时新建分支从origin/master
            await git.checkout(['-b', ROLLBACK_BRANCH.local, 'origin/master']);
        }

        await git.mergeFromTo(ROLLBACK_BRANCH.mergeFrom, ROLLBACK_BRANCH.local);

        console.log('===> merge success...');

        await commit();

        console.log('===> commit success...');

        await git.checkout(['-']);

        console.log('===> [回滚分支已准备就绪]，返回前一个分支...')
    } catch (err) {
        console.log('err:', err);
    }
}

/** @desc 提交流程 */
const commit = async () => {
    try {
        console.log('===> 1.commit start...')
        const status = await git.status();

        const { current } = status;

        await git.add('./*');

        //await git.commit(`feat: 自动提交流程`);
        await git.raw(['commit', '-m"feat: 自动提交流程"', '--no-verify']);

        if (current === ROLLBACK_BRANCH.local) {
            console.log('===> start: 1.1放弃本地更改，接受远程修改')
            await git.raw(['fetch', '--all']);
            await git.raw(['reset', '--hard', 'origin/develop']);
            console.log('===> end: 1.2放弃本地更改，接受远程修改')
        } else {
            await git.pull();
        }

        await git.push('origin', current);

        console.log('===> 2.commit success...')
    } catch (err) {
        console.log('提交流程报错:', err);
    }
}

/** @desc 检测某个分支是否存在 */
const exist = async (bname) => {
    try {
        const res = await git.raw(['branch', '-r']);

        return res.indexOf(bname) > -1;
    } catch (err) {
        return -1;
    }
}

/** @desc 初始化函数 */
const init = async (options) => {
    console.log('===> init...', options);
    if (options && Object.prototype.toString.call(options) === '[object Object]' && Object.keys(options).length) {
        const { local, remote, mergeFrom } = options;
        if (local && remote) {
            ROLLBACK_BRANCH = {
                local,
                remote,
                mergeFrom
            }
        }
    }

    // 执行run()方法
    run();
}

init();