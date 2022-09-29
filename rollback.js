
/** @desc 快速生成回滚分支入口 */
const { init } = require('faster-rollback');

/**
 * @desc 默认回滚分支配置
 * @method init()
 * @params options = { 
 *    local: 'rollback_dev',
 *    remote: 'origin/rollback_dev',
 *    mergeFrom: 'origin/master'
 * }
*/
init({
    local: 'rollback_dev5',
    remote: 'origin/rollback_dev5',
    mergeFrom: 'origin/master'
});




