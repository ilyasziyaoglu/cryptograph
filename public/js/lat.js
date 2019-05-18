var latTable

var prepareLatTable
var calcLatTable
var latValue
var latXOR
var setLatTable
var nonLinearity
var NLMs

$(document).ready(function(){
    document.getElementById('set-lat-table').onclick = function(){
        SBox = getSBoxTable()

        document.getElementById('lat-table-head').innerHTML = ''
        document.getElementById('lat-table-body').innerHTML = ''

        prepareLatTable(SBox)
        latTable = calcLatTable(SBox)
        setLatTable(latTable)
        document.getElementById('non-linearity').innerText = 'Nonlinearity: %' + (Math.round(nonLinearity(latTable) * 100) / 100)
    }

    prepareLatTable = function(SBox){
        var head = document.getElementById('lat-table-head')
        var body = document.getElementById('lat-table-body')

        head.appendChild(createElement('th', {scope: 'col', innerText: '#', style: 'text-align: center;'}))
        for(var i = 0; i < SBox.length; i++){
            head.appendChild(createElement('th', {scope: 'col', style: 'text-align: center;', innerText: SBox[i][0]}))
            var tr = createElement('tr')
            tr.appendChild(createElement('th', {scope: 'row', style: 'text-align: center;', innerText: SBox[i][0]}))
            body.appendChild(tr)
        }
    }

    setLatTable = function(latTable){
        var body = document.getElementById('lat-table-body')

        for(var i = 0; i < latTable.length; i++){
            for(var j = 0; j < latTable[0].length; j++){
                body.childNodes[i].appendChild(createElement('td', {innerText: latTable[i][j], style: 'text-align: center;'}))
            }
        }
    }

    calcLatTable = function(SBox){
        var maxLat = Math.pow(2, n-1)
        var latTable = []
        for(var i = 0; i < SBox.length; i++){
            latTable.push([])
            for(var j = 0; j < SBox.length; j++){
                latTable[i].push(0)
                for(var k = 0; k < SBox.length; k++){
                    latTable[i][j] += latValue(int2binstr(parseInt(SBox[i][0], 16), n), int2binstr(parseInt(SBox[j][0], 16), n), int2binstr(parseInt(SBox[k][0], 16), n), int2binstr(parseInt(SBox[k][1], 16), n))
                }
                latTable[i][j] = latTable[i][j] - maxLat
            }
        }
        return latTable
    }

    latValue = function(inMask, outMask, x, y){
        var A = ''
        var B = ''
        for(var i = 0; i < inMask.length; i++){
            A += inMask[i] * x[i]
            B += outMask[i] * y[i]
        }
        //console.log(inMask, outMask)
        //console.log(x, y)
        //console.log(A, B)
        //console.log(latXOR(A, B)^1)
        return latXOR(A, B)
    }

    latXOR = function(A, B){
        var a = 0
        var b = 0
        for(var i = 0; i < A.length; i++){
            if(A[i] == '1'){
                a++
            }
            if(B[i] == '1'){
                b++
            }
        }
        return (((a + b) % 2) + 1) % 2
    }

    nonLinearity = function(table){
        var nlms = NLMs(table)
        var nonLinearity = Math.pow(2, n-1) - Math.pow(2, (n/2)-1)
        return (nlms * 100/nonLinearity)
    }

    NLMs = function(table){
        var max = 0
        var val = 0
        table[0][0] = 0

        // getting absolute values
        for(var i = 1; i < table.length; i++){
            for(var j = 1; j < table.length; j++){
                table[i][j] = Math.abs(table[i][j])
            }
        }

        // getting max value
        for(var i = 1; i < table.length; i++){
            val = Math.max.apply(null, table[i])
            if(max < val){
                max = val
            }
        }
        
        return (Math.pow(2, n-1) - max)
    }
})