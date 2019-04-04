var ddtTable

var prepareDdtTable
var calcDdtTable
var ddtValue
var ddtXOR
var setDdtTable

$(document).ready(function(){
    document.getElementById('set-ddt-table').onclick = function(){
        SBox = getSBoxTable()
        
        document.getElementById('ddt-table-head').innerHTML = ''
        document.getElementById('ddt-table-body').innerHTML = ''

        prepareDdtTable(SBox)
        ddtTable = calcDdtTable(SBox)
        setDdtTable(ddtTable)
    }

    prepareDdtTable = function(SBox){
        var head = document.getElementById('ddt-table-head')
        var body = document.getElementById('ddt-table-body')

        head.appendChild(createElement('th', {scope: 'col', innerText: '#', style: 'text-align: center;'}))
        for(var i = 0; i < SBox.length; i++){
            head.appendChild(createElement('th', {scope: 'col', innerText: SBox[i][0], style: 'text-align: center;'}))
            var tr = createElement('tr')
            tr.appendChild(createElement('th', {scope: 'row', innerText: SBox[i][0], style: 'text-align: center;'}))
            body.appendChild(tr)
        }
    }

    setDdtTable = function(ddtTable){
        var body = document.getElementById('ddt-table-body')

        for(var i = 0; i < ddtTable.length; i++){
            for(var j = 0; j < ddtTable[0].length; j++){
                body.childNodes[i].appendChild(createElement('td', {innerText: ddtTable[i][j], style: 'text-align: center;'}))
            }
        }
    }

    calcDdtTable = function(SBox){
        var ddtTable = []
        for(var i = 0; i < SBox.length; i++){
            ddtTable.push([])
            for(var j = 0; j < SBox.length; j++){
                ddtTable[i].push(ddtValue(SBox, SBox[i][0], SBox[j][0]))
            }
        }
        return ddtTable
    }

    ddtValue = function(SBox, a, b){
        var count = 0
        for(var i = 0; i < SBox.length; i++){
            //console.log('a: ', int2binstr(parseInt(a, 16), n), 'b: ', int2binstr(parseInt(b, 16), n))
            //console.log("i: ", i)
            var sx = int2binstr(parseInt(SBox[i][1], 16), n)
            //console.log('sx: ', sx)
            var xa = ddtXOR(int2binstr(i, n), int2binstr(parseInt(a, 16), n))
            //console.log(int2binstr(parseInt(SBox[i][0], 16), n) + ' XOR ' + int2binstr(parseInt(a, 16), n))
            //console.log('xa: ', xa, 'int xa: ', parseInt(xa, 2))
            var sxa = int2binstr(parseInt(SBox[parseInt(xa, 2)][1], 16), n)
            //console.log('sxa: ', sxa)
            var sxsxa = ddtXOR(sx, sxa)
            //console.log('sxsxa: ', sxsxa)
            //console.log(sxsxa + ' =? ' + int2binstr(parseInt(b, 16), n))
            if(parseInt(sxsxa, 2).toString(16).toUpperCase() == b){
                count++
            }
        }
        //console.log('count: ', count)
        return count
    }

    ddtXOR = function(A, B){
        var xor = ''
        for(var i = 0; i < A.length; i++){
            xor += A[i]^B[i]
        }
        return xor
    }
})