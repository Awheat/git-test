/**
 * @desc 自动生成rollback_dev分支流程
 * 1. 查看当前分支是否有提交
 * 2. 若存在走提交流程
 * 3. 
*/
const simpleGit = require('simple-git');

const git = simpleGit('./');

const ROLLBACK_BRANCH = {
    local: 'rollback_dev',
    remote: 'origin/rollback_dev'
};


/** @desc 获取远程是否存在某个分支 */
const isExistBranch = async (bname) => {
    try {
        const res = await git.raw(['branch', '-r']);

        return res.indexOf(bname) > -1;
    } catch (err) {
        console.log('isExistBranch:', err);
        return -1;
    }
}

/** @desc 提交流程 */
const actionCommitFlow = async () => {
    try {
        const status = await git.status();

        const { current } = status;

        await git.add('./*');

        await git.commit(`feat: 分支[${current}]自动提交流程`);

        if (current === ROLLBACK_BRANCH.local) {
            console.log('===> start: 放弃本地更改，接受远程修改')
            await git.raw(['fetch', '--all']);
            await git.raw(['reset', '--hard', 'origin/develop']);
            console.log('===> end: 放弃本地更改，接受远程修改')
        }

        await git.pull();

        await git.push('origin', current);

        console.log('===> commit_flow_ending～')
    } catch (err) {
        console.log('提交流程报错:', err);
    }
}

const actionInit = async () => {
    try {
        // 提交流程
        await actionCommitFlow();

        const isExist = await isExistBranch(ROLLBACK_BRANCH.remote);

        console.log('---isExist---', isExist);

        if (isExist) {
            // 如果存在，切换到对应的分支
            await git.checkout(ROLLBACK_BRANCH.local);
        } else {
            // 如果不存在，切换的同时新建分支从origin/master
            await git.checkout(['-b', ROLLBACK_BRANCH.local, 'origin/master']);
        }

        await git.mergeFromTo('origin/master', ROLLBACK_BRANCH.local);

        console.log('===> merge success!');

        await actionCommitFlow();

        console.log('===> commit success!');

        await git.checkout(['-']);
    } catch (err) {
        console.log('err:', err);
    }
}

actionInit();