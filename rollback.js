
/** @desc 快速生成回滚分支入口 */
const nr = require('naver-rollback');

/**
 * @desc 默认回滚分支配置
 * @method init()
 * @params options = { 
 *    local: 'rollback_dev',
 *    remote: 'origin/rollback_dev',
 *    mergeFrom: 'origin/master'
 * }
*/
nr.init({
    local: 'rollback_dev3',
    remote: 'origin/rollback_dev3',
    mergeFrom: 'origin/master'
});
