
/** @desc 快速生成回滚分支入口 */
const nr = require('naver-rollback');

/**
 * @desc 默认回滚分支配置
 * 可选参数: options = { 
 *    local: 'rollback_dev',
 *    remote: 'origin/rollback_dev'
 * }
*/
nr.init();
