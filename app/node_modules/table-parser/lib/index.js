/**
 * Shell Table Parser
 */

module.exports.parse = function( output ){

    // 首先要分隔行
    var linesTmp = output.split( '\n' );
    // 每一行的内容
    var lines = [];
    // 标题信息
    var titleInfo = {};
    // 获取数据
    var tableArray = [];
    // 记录每一行被作为边际的次数，用于寻找可以用来被作为边界的列
    var colCount = {};
    // 计算出来的可以被作为边际的列号
    var lineArray = [];
    // 记录最长的行长度
    var longest;
    var colIdx;

    // 清除所有的空行
    linesTmp.forEach(function( line ){
        if( line.trim() ){
            lines.push( line );
        }
    });

    // 逐行扫描
    lines.forEach(function( line, index ){

        // 认为第一行为标题行
        if( index == 0 ){
            var fields = line.split( /\s+/ );
            // 保存各字段的开始和结束位置
            fields.forEach(function( field ){

                if( field ){
                    var info = titleInfo[ field ] = {};
                    // 记录字段值的开始和结束
                    info.titleBegin = line.indexOf( field );
                    info.titleEnd = info.titleBegin + field.length - 1;
                }
            });
        }
        else {
            // 记录单行的位置情况，防止出现多次出现相同值的情况
            var valuePosRecord = {};
            var values = line.trim().split( /\s+/ );
            values.forEach(function( value ){

                var begin = line.indexOf( value, valuePosRecord[ value ] );
                var end = begin + value.length - 1;
                valuePosRecord[ value ] = end;

                if( !colCount[ begin ] ){
                    colCount[ begin ] = 0;
                }
                if( !colCount[ end ] ){
                    colCount[ end ] = 0;
                }

                // 记录边界值
                colCount[ begin ]++;
                colCount[ end ]++;

            });

            // 计算最长的一行
            if( longest == undefined ){
                longest = line.length;
            }
            else if( longest < line.length ){
                longest = line.length;
            }
        }
    });

    var dataLineLen = lines.length - 1;
    // 确定出可以作为分割线的列数
    for( colIdx in colCount ){
        if( colCount[ colIdx ] == dataLineLen ){
            lineArray.push( colIdx );
        }
    }
    // 将最长一行加进去作为结尾
    lineArray.push( String( longest - 1 ) );
    // 同时各标题边界也考虑进去
    var field;
    var tInfo;
    for( field in titleInfo ){
        tInfo = titleInfo[ field ];
        lineArray.push( tInfo.titleBegin );
        lineArray.push( tInfo.titleEnd );
    }

    // 现在确定每个字段的边界
    var prevTInfo;
    for( field in titleInfo ){
        tInfo = titleInfo[ field ];
        tInfo.begin = getNearestNum( tInfo.titleBegin, lineArray, false );
        tInfo.end = getNearestNum( tInfo.titleEnd, lineArray, true );

        // 若当前字段和上字段的begin相同，则当前字段的begin设置为titleBegin
        if( prevTInfo && prevTInfo.begin === tInfo.begin ){
            tInfo.begin = tInfo.titleBegin;
        }

        // 若上一字段和当前字段的end值相同，则上一字段的end值为当前字段的titleBegin
        if( prevTInfo && prevTInfo.end === tInfo.end ){
            prevTInfo.end = tInfo.titleBegin;
        }
        prevTInfo = tInfo;
    }

    lines.forEach(function( line, index ){
        // 跳过第一行
        if( index > 0 ){

            var values = line.split( /\s+/ );
            var rawData = {};
            // 记录单行的位置情况，防止出现多次出现相同值的情况
            var valuePosRecord = {};
            // 使用"包裹的由空格分割的连续值，比如："program files";
            var continuedValue = null;

            values.forEach(function( seg ){

                var segBegin = line.indexOf( seg, valuePosRecord[ seg ] );
                var segEnd = segBegin + seg.length - 1;
                var valueBegin;
                var valueEnd;
                var value;
                valuePosRecord[ seg ] = segEnd;

                // 若为一个连续值的开头
                if( seg.indexOf( '"' ) === 0 ){
                    continuedValue = {
                        begin: segBegin,
                        value: seg
                    }
                }
                // 若为一个连续值的结尾
                // 考虑 --name="neekey" 这样的情况，因此continueValue必须存在
                else if( continuedValue && seg[ seg.length - 1 ] == '"' ){
                    continuedValue.end = segEnd;
                    continuedValue.value += seg;
                }
                // 若为之间的字段
                else if( continuedValue ){
                    continuedValue.value += ( ' ' + seg );
                }

                if( ( continuedValue && continuedValue.end ) || !continuedValue ){

                    if( continuedValue ){
                        valueBegin = continuedValue.begin;
                        valueEnd = continuedValue.end;
                        value = continuedValue.value;
                        continuedValue = undefined;
                    }
                    else {
                        valueBegin = segBegin;
                        valueEnd = segEnd;
                        value = seg;
                    }

                    // 确定字段所在的字段空间
                    var field;
                    var tInfo;
                    for( field in titleInfo ){
                        tInfo = titleInfo[ field ];
                        if( tInfo.begin <= valueBegin && tInfo.end >= valueEnd ){

                            if( !rawData[ field ] ){
                                rawData[ field ] = [];
                            }

                            rawData[ field ].push( value );
                            break;
                        }
                    }
                }
            });
            tableArray.push( rawData );
        }
    });

    return tableArray;
};

/**
 * 获取与当前值最近的数字
 * @param cur {Number} 当前数字
 * @param list {Number[]} 待查找数字列表
 * @param ifGrate 目标数字是否大于当前值
 * @return {*}
 */

function getNearestNum( cur, list, ifGrate ){

    ifGrate = ( typeof ifGrate === 'undefined' ? false : ifGrate );
    var nearest = cur;
    var min = null;

    list.forEach(function( value ){

        if( ( value - cur > 0 ) == ifGrate && Math.abs( value - cur ) > 0 ){
            if( min === null ){
                min = Math.abs( value - cur );
                nearest = value;
            }
            else {
                if( Math.abs( value - cur ) < min ){
                    min = Math.abs( value - cur );
                    nearest = value;
                }
            }
        }
    });

    if( min === null ){
        nearest = cur;
    }

    return nearest;
}