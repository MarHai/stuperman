export module Statistics {
    export function random(_nMin: number = 1, _nMax: number = 10) {
        return Math.floor((Math.random() * _nMax) + _nMin);
    }
    
    export function sum(_aNr: number[]) {
        let nNr = 0;
        _aNr.forEach( (_nNr: number) => nNr += _nNr === null ? 0 : _nNr);
        return nNr;
    }
    
    export function diff(_nNrA: number, _nNrB: number) {
        return Math.abs(_nNrA - _nNrB);
    }
    
    export function sd(_aNr: number[], _nRound = 2) {
        let mMean = mean(_aNr, _nRound);
        if(mMean === null) {
            return null;
        } else {
            let aDeviation: number[] = [];
            let nMean = +mMean;
            _aNr.forEach( (_nNr: number) => {
                    if(_nNr !== null) {
                        aDeviation.push(Math.pow(_nNr - nMean, 2));
                    }
                });
            return Math.sqrt(+mean(aDeviation, _nRound)).toFixed(_nRound);
        }
    }
    
    export function countOccurences(_aNr: number[]) {
        let oNrCount = {};
        _aNr.forEach( (_nNr: number) => {
                if(typeof(oNrCount[_nNr]) === 'undefined') {
                    oNrCount[_nNr] = 1;
                } else {
                    oNrCount[_nNr]++;
                }
            });
        return oNrCount;
    }
    
    export function mode(_aNr: number[]) {
        let oNrCount = countOccurences(_aNr);
        let sMaxIndex: string = null;
        let aReturn: number[] = [];
        for(let sNr in oNrCount) {
            if(sMaxIndex === null || oNrCount[sNr] >= oNrCount[sMaxIndex]) {
                sMaxIndex = sNr;
                aReturn.push(+sNr);
            }
        }
        if(aReturn.length > 0) {
            if(oNrCount[aReturn[0]] < oNrCount[sMaxIndex]) {
                aReturn = aReturn.slice(1);
            }
        }
        return aReturn;
    }
    
    export function median(_aNr: number[], _nRound = 2) {
        if(_aNr.length == 0) {
            return null;
        } else {
            _aNr.sort();
            if(_aNr.length % 2 == 0) {
                return +mean([ _aNr[Math.floor((_aNr.length-1)/2)], _aNr[Math.ceil((_aNr.length-1)/2)] ], _nRound);
            } else {
                return _aNr[(_aNr.length-1)/2];
            }
        }
    }
    
    export function mean(_aNr: number[], _nRound = 2) {
        let nN = 0;
        let nSum = 0.0;
        _aNr.forEach( (_nNr: number) => {
                if(_nNr !== null) {
                    nN++;
                    nSum += _nNr;
                }
            });
        return nN > 0 ? (nSum/nN).toFixed(_nRound) : null;
    }
    
    export function weightedMean(_aNr: number[], _aWeight: number[], _nRound = 2) {
        let nN = 0;
        let nSum = 0.0;
        for(let i = 0; i < _aNr.length; i++) {
            if(_aNr[i] !== null && typeof(_aWeight[i]) !== 'undefined' && _aWeight[i] > 0) {
                nN += _aWeight[i];
                nSum += _aNr[i]*_aWeight[i];
            }
        }
        return nN > 0 ? (nSum/nN).toFixed(_nRound) : null;
    }
}