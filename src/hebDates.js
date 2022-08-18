import { Temporal } from '@js-temporal/polyfill'

const alphaBiet = [ 
  {letter:'ץ',code:900},{letter:'ף',code:800},{letter:'ן',code:700},{letter:'ם',code:600},{letter:'ך',code:500},
  {letter:'ת',code:400}, {letter:'ש',code:300} , {letter:'ר',code:200}, {letter:'ק',code:100}, {letter:'צ',code:90}, {letter:'פ',code:80}, {letter:'ע',code:70}, {letter:'ס',code:60}, {letter:'נ',code:50}, {letter:'מ',code:40}, {letter:'ל',code:30}, {letter:'כ',code:20}, {letter:'י',code:10}, {letter:'ט',code:9}, {letter:'ח',code:8}, {letter:'ז',code:7}, {letter:'ו',code:6}, {letter:'ה',code:5}, {letter:'ד',code:4}, {letter:'ג',code:3}, {letter:'ב',code:2}, {letter:'א',code:1} ];

Number.prototype.gim = function (manTsaPach=false) {
  let gim = ''
  let num = this.valueOf()
  alphaBiet.slice(manTsaPach ? 0 : 5).forEach(l => {
    while ( num >= l.code) {
        gim+=l.letter
        num-=l.code
        }
    })
  return gim
}

export const newTDate = ({d,m,y} = {d:null,m:null,y:null}) => { 
  if(isValidHebDate({d,m,y})) 
    return Temporal.PlainDate.from({day:d,month:m,year:y,calendar:'hebrew'})
  else
    return null
}
// validate date range
export const isValidHebDate = ({d,m,y}) => {
  if ( !d || !m || !y ) 
    return false
  return (y>=0 && y<=6000 && m>=1 && m<=13 && d>=1 && d<=30)
}

export default { gim: Number.prototype.gim }



