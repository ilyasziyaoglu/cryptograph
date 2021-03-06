var target
var n
var polinom
var mod
var objects
var polinomObjects
var binaryObjects
var mapTable
var SBox
var sbox = 0
var IrreduciblePrimePols


var createElement
var readInputs
var tableSetFirstCol
var tableSetCol
var binaryToPolinom
var int2binstr
var objectCreation
var getPolinomObjects
var getBinaryObjects
var mapping
var getHexMapping
var getMappingView
var prepareSBoxTable
var setSBoxTable
var getSBoxTable
var findIrreduciblePrimePols


$(document).ready(function(){

    document.getElementById('n').onchange = function(){
        document.getElementById('polinom').value = '' // clearing content when n changed
        n = parseFloat(this.value) // getting value of n

        polinoms = findIrreduciblePrimePols(n) // finding all irreducible and prime polinoms for n
        
        // handling datalist element and clearing content
        var datalist = document.getElementById('datalist')
        datalist.innerHTML = ''

        // push polinoms to datalist
        for(var i in polinoms){
            datalist.appendChild(createElement('option', {value: polinoms[i], innerHTML: binaryToPolinom(polinoms[i])}))
        }
    }

    document.getElementById('submit').onclick = function(){
        readInputs()

        mod = Math.pow(2, n) - 1
        document.getElementById('mod').innerText = 'Mod: ' + mod
        document.getElementById('pol').innerHTML ='Polinom: ' + binaryToPolinom(polinom)

        prepareSBoxTable(mod)
    }

    document.getElementById('create-objects').onclick = function(){
        document.getElementById('bad-polinom').style.display = 'none'
        document.getElementById('table-head').innerHTML = ''
        document.getElementById('table-body').innerHTML = ''

        objects = objectCreation(n, polinom)
        tableSetFirstCol(objects.length)
        binaryObjects = getBinaryObjects(objects, n)
        polinomObjects = getPolinomObjects(binaryObjects)
        tableSetCol('Objects', polinomObjects)
        tableSetCol('Binaries', binaryObjects)

        if(objects.length == mod + 1){ // if polynomial is irreducible and prime polynomial
            mapTable = mapping(objects.length, target, mod)
            var mapView = getMappingView(mapTable)
            tableSetCol('Mapping', mapView)
            hexMap = getHexMapping(mapTable, objects)
            var hexMapView = getHexMappingView(hexMap)
            tableSetCol('Hex Mapping', hexMapView)
        }
        else {
            document.getElementById('bad-polinom').style.display = 'block'
        }
    }

    document.getElementById('create-sbox').onclick = function(){
        SBox = hexMap.sort()
        setSBoxTable(SBox)
    }

    document.getElementById('update-sbox').onclick =  function(){
        SBox = getSBoxTable()
    }

    createElement = function(tag, prop){
        var element = document.createElement(tag)
        for(var i in prop){
            element[i] = prop[i]
        }
        return element
    }

    readInputs = function(){
        target = parseFloat(document.getElementById('target').value)
        n = parseFloat(document.getElementById('n').value)
        polinom = document.getElementById('polinom').value
    }

    tableSetFirstCol = function(len){
        document.getElementById('table-head').appendChild(createElement('th', {scope: 'col', innerText: '#'}))
        var body = document.getElementById('table-body')
        for(var i = 0; i < len; i++){
            var tr = createElement('tr')
            tr.appendChild(createElement('td', {innerHTML: binaryToPolinom(int2binstr(Math.pow(2, i), i+1))}))
            body.appendChild(tr)
        }
    }

    tableSetCol = function(header, data){
        document.getElementById('table-head').appendChild(createElement('th', {scope: 'col', innerText: header}))
        var body = document.getElementById('table-body')
        for(var i = 0; i < data.length; i++){
            body.childNodes[i].appendChild(createElement('td', {innerHTML: data[i]}))
        }
    }

    prepareSBoxTable = function(mod){
        var head = document.getElementById('sbox-table-head')
        var body = document.getElementById('sbox-table-body')
        if(sbox != n){
            sbox = n
            head.innerHTML = ''
            body.innerHTML = ''
            for(var i = 0; i <= mod; i++){
                head.appendChild(createElement('th', {scope: 'col',innerText: i.toString(16).toUpperCase(), style:'text-align: center;'}))
                var td = createElement('td')
                td.appendChild(createElement('input', {type: 'text', style: 'width: 33px; text-align: center; display: block; margin: auto;'}))
                body.appendChild(td)
            }
        }
    }

    setSBoxTable = function(hexMap){
        hexMap = hexMap.sort()
        var body = document.getElementById('sbox-table-body')
        for(var i = 0; i < hexMap.length; i++){
            body.childNodes[i].childNodes[0].value = hexMap[i][1]
        }
    }

    getSBoxTable = function(){
        var body = document.getElementById('sbox-table-body')
        var SBox = []
        for(var i = 0; i < body.childNodes.length; i++){
            SBox.push([i.toString(16).toUpperCase(), '0'])
            SBox[i][1] = body.childNodes[i].childNodes[0].value
        }
        return SBox
    }

    binaryToPolinom = function(binary){
        var polinom = ''
        var len = binary.length - 1
        for(var i = len; i >= 0; i--){
            if(binary[i] == '1' && i == len){
                polinom = 'X<sup>0</sup>'
            }
            else if(binary[i] == '1' && i == len - 1){
                if(polinom == ''){
                    polinom = 'X<sup>1</sup>'
                }
                else {
                    polinom = 'X<sup>1</sup> + ' + polinom
                }
            }
            else if(binary[i] == '1' && i < len - 1){
                if(polinom == ''){
                    polinom = 'X<sup>' + (len-i) + '</sup>'
                }
                else {
                    polinom = 'X<sup>' + (len-i) + '</sup> + ' + polinom
                }
            }
        }
        return polinom
    }

    int2binstr = function(int, bitCount){
        var binStr = int.toString(2)

        while(binStr.length < bitCount){
            binStr = '0' + binStr
        }

        return binStr
    }

    objectCreation = function(n, polinom){
        var len = Math.pow(2, n)
        var objects = [1]
        var temp = 1
        for(var i = 1; i < len; i++){
            temp = temp << 1
            if(temp >= len){
                temp = parseInt(int2binstr(temp, n+1).slice(1, n+1), 2)^parseInt(polinom.slice(1, polinom.length), 2)
                if(objects.includes(temp)){
                    objects.push(temp)
                    return objects
                }
                else{
                    objects.push(temp)
                }
            }
            else{
                if(objects.includes(temp)){
                    objects.push(temp)
                    return objects
                }
                else {
                    objects.push(temp)
                }
            }
        }
        return objects
    }
    
    getPolinomObjects = function(binaryObjects){
        var polinomObjects = []
        for(var i = 0; i < binaryObjects.length; i++){
            polinomObjects.push(binaryToPolinom(binaryObjects[i]))
        }
        return polinomObjects
    }

    getBinaryObjects = function(objects, bitCount){
        var binaryObjects = []
        for(var i = 0; i < objects.length; i++){
            binaryObjects.push(int2binstr(objects[i], bitCount))
        }
        return binaryObjects
    }

    mapping = function(objectLength, target, mod){
        mapTable = [[0, 0]]
        var map
        for(var i = 1; i < objectLength; i++){
            map = (i * target) % mod
            if(map < 0){
                mapTable.push([i, mod + map])
            }
            else {
                mapTable.push([i, -map])
            }
        }
        return mapTable
    }

    getMappingView = function(mapTable){
        var mapView = []
        for(var i = 0; i < mapTable.length; i++){
            var map = binaryToPolinom(int2binstr(Math.pow(2, mapTable[i][0]), mapTable[i][0]+1)) + ' --> ' + binaryToPolinom(int2binstr(Math.pow(2, mapTable[i][1]), mapTable[i][1]+1))
            mapView.push(map)
        }
        return mapView
    }

    getHexMapping = function(mapTable, objects){
        var hexMap = [["0", "0"]]
        for(var i = 1; i < mapTable.length; i++){
            hexMap.push([objects[mapTable[i][0]].toString(16).toUpperCase(), objects[mapTable[i][1]].toString(16).toUpperCase()])
        }
        return hexMap
    }

    getHexMappingView = function(hexMap){
        var hexMapView = []
        for(var i = 0; i < hexMap.length; i++){
            hexMapView.push(hexMap[i][0] + ' --> ' + hexMap[i][1])
        }
        return hexMapView
    }

    reset = function(){
        target = undefined
        n = undefined
        polinom = undefined
        mod = undefined
        objects = undefined
        polinomObjects = undefined
        binaryObjects = undefined
        mapTable = undefined
        SBox = undefined
        sbox = 0
    }

    findIrreduciblePrimePols = function(n){
        mod = Math.pow(2, n) - 1
        IrreduciblePrimePols = []
        for(var i = mod + 2; i < Math.pow(2, n+1); i++){
            if(objectCreation(n, i.toString(2)).length == mod + 1){
                IrreduciblePrimePols.push(i.toString(2))
            }
        }
        return IrreduciblePrimePols
    }
})