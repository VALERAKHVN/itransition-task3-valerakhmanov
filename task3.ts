import * as crypto from 'crypto';
import {sha256} from 'js-sha256';
var AsciiTable = require('ascii-table')

class Rules {
    getRulesTable(moveAmount) {
        let possibleMoves = this.arrayFill(moveAmount);
        let rulesTable: string[] = [];
        for (let i = 0; i < moveArray.length; i++) {
            let rowArr;
            for (let j = 0; j < moveArray.length; j++) {
                rowArr = possibleMoves.slice(moveAmount - i, moveAmount).concat(possibleMoves.slice(0, moveAmount - i));
            }
            rulesTable[i] = rowArr;
        }
        return rulesTable;
    }

    arrayFill(moveAm) {
        let result = [];
        result[0] = 'draw';
        let half = (moveAm - 1) / 2;
        return result.concat(this.fillHalf(half, 'win')).concat(this.fillHalf(half, 'lose'));
    }

    fillHalf(amount: number, value: string) {
        let array: string[] = [];
        for (let k = 0; k < amount; k++) {
            array.push(value);
        }
        return array;
    }

    printTable(ruleTable, moveAmount, moveArray){

        let heading = [' v PC\User >'];
        heading = heading.concat(moveArray);
        let rows = [];
        for(let i = 0; i < moveAmount; i++){
            rows[i] = [moveArray[i]].concat(ruleTable[i])
        }
        var table = AsciiTable.factory('Rules')
        var table = AsciiTable.factory({
            title: 'Title'
          , heading: [...heading]
          , rows: rows
          })

          console.log(table.toString())
    }
}

class Encrypt{
    public getHmac(key: string, message: string){
        return sha256.hmac(key, message);
    }

    getKey(){
        let key = crypto.randomBytes(32);
        return sha256.hex(key)
    }
}

class Game{
    public makeMove(moveAmount){
        return crypto.randomInt(moveAmount);
    }

    public calcWinner(userMove, pcMove, rulesTable){
        return rulesTable[pcMove][userMove];
    }
}

let moveArray = process.argv.splice(2, process.argv.length - 1);
let dups = moveArray.filter((item, index) => moveArray.indexOf(item) !== index);
if (moveArray.length < 3) {
    console.log('Argument amount less than 3. Example: rock paper scissors');
}
else if (!(moveArray.length % 2)) {
    console.log('Amount of moves should be uneven. Example: rock paper scissors');
}
else if(dups.length){
    console.log('Theres duplicated moves');
}
else{
    let moveAmount = moveArray.length;
let rules = new Rules;
let ruleTable = rules.getRulesTable(moveAmount);

let game = new Game;
let pcMoveNum = game.makeMove(moveAmount);
let pcMoveStr = moveArray[pcMoveNum];
let encrypt = new Encrypt;
let key = encrypt.getKey().toString();
let HMACMove = encrypt.getHmac(pcMoveStr, key);
console.log('HMAC: ' + HMACMove);
console.log('Available moves:')
for(let i = 0; i < moveAmount; i++){
    console.log(`${i+1} - ${moveArray[i]}`);
}
console.log('? - help');

const readline = require('node:readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question("Enter your move: ", (answer) => {
    if(answer === '?'){
        rules.printTable(ruleTable, moveAmount, moveArray);
        // console.table(ruleTable);
    }
    if(answer && +answer <= moveAmount){
        console.log(`Your move: ${moveArray[+answer - 1]}`);
        console.log(`Computer move: ${pcMoveStr}`);
        console.log(`You ${game.calcWinner(+answer - 1, pcMoveNum, ruleTable)}`);
        console.log(`HMAC key: ${key}`);
    }
    else if(!answer || answer != '?'){
        console.log('incorrect input')
    }
    rl.close();
});
}



