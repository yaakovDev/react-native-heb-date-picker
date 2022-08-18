import React,{useCallback,useEffect,useRef,useState} from 'react'
import {Text,View,FlatList,StyleSheet,scrollToIndex} from 'react-native'
import gim,{newTDate} from './hebDates'


const _days30 = ['א','ב','ג','ד','ה','ו','ז','ח','ט','י','יא','יב','יג','יד','טו','טז','יז','יח','יט','כ','כא','כב','כג','כד','כה','כו','כז','כח','כט','ל'].map( (i,index)=> ({day:index+1,name:i}))
const _days29 = ['א','ב','ג','ד','ה','ו','ז','ח','ט','י','יא','יב','יג','יד','טו','טז','יז','יח','יט','כ','כא','כב','כג','כד','כה','כו','כז','כח','כט'].map( (i,index)=> ({day:index+1,name:i}))
const _months = ['תשרי','חשון','כסלו','טבת','שבט','אדר','ניסן','אייר','סיון','תמוז','אב','אלול'].map( (i,index)=> ({month:index+1,name:i}))
const _months_leap = ['תשרי','חשון','כסלו','טבת','שבט','אדר-א','אדר-ב','ניסן','אייר','סיון','תמוז','אב','אלול'].map( (i,index)=> ({month:index+1,name:i}))


const OneSpinner = ({data,width,index,_height,flat_item,addPadding,onSpinnerChange}) => {

  const listRef = useRef()
  const spinner_timeout = useRef(0)
  const prevIndex = useRef(-1)


  useEffect(() => {
    if(index)
      listRef.current.scrollToIndex({animated:true,index,viewPosition:addPadding ? 0 : 0})
  },[])
  
  //triggers only on user gesture, but not on calling 'scrollToIndex'
  const onMomentumScrollEnd = useCallback((event) => {
    const index = Math.round(event.nativeEvent.contentOffset.y / _height)
    if ( index==prevIndex.current)
      return

    if ( !onSpinnerChange ) 
      return      

    clearTimeout( spinner_timeout.current );
    spinner_timeout.current = setTimeout( () => {
      prevIndex.current = index
      onSpinnerChange(data[index])
      },200)
  
  }, []); 

  const getItemLayout = (data, index) => (
      { length: _height, offset: _height* index, index })
    
  const renderItem = useCallback(({item}) => {
        return <Text style={{...flat_item,height:_height,width}}>{item.name}</Text>
  },[])

  const renderEmptyItem = useCallback( () => {
    if ( addPadding )
      return <Text style={{...flat_item,height:_height,width}}></Text>
    else
      return null
},[])
  
    
    return <FlatList
       data={data}
       ListHeaderComponent={renderEmptyItem}
       renderItem={renderItem}
       ListFooterComponent={renderEmptyItem}
       getItemLayout={getItemLayout}
       keyExtractor={(_,index) => index.toString()}
       showsVerticalScrollIndicator={false}
       showsHorizontalScrollIndicator={false}      
       snapToAlignment="start"
       decelerationRate={"normal"}
       snapToInterval={_height}       
       //onScroll={onScroll}
       onMomentumScrollEnd={onMomentumScrollEnd}
       ref={listRef}
     />
}


export const HebDateSpinner = ({size,addPadding, dmy: _dmy,year_spinner,onSpinnerChange}) => {

  if(!_dmy) {
    console.error(`'dmy' property is missing`);
    return null
    }

  const dmy = useRef(_dmy)
  const isLeap = useRef(newTDate(_dmy).inLeapYear)  
  const isFullMonth = useRef((newTDate({..._dmy,d:30}).day==30))  

  const {from,to} = year_spinner??{from:_dmy.y-10,to:_dmy.y+10}
  if(from>to) {
      console.error(`invalid 'year_spinner' property value`);
      return null
    }

  const [_years] = useState([...Array(to-from+1).keys()].map( (_,index)=> {
    const thousands = parseInt((from+index)/1000)*1000
    return {
      year:from+index,
      name:((from-thousands)+index).gim(),
      inLeapYear:newTDate({d:1,m:1,y:from+index}).inLeapYear
      }
    }))

  const _setDmy = (_dmy) => { 
    dmy.current = _dmy
    onSpinnerChange?.(_dmy)
   }

  const onDaySpinnerChange = (item) => { 
    _setDmy({...dmy.current,d:item.day})
  }

  const onMonthSpinnerChange = (item) => {

    let _d = dmy.current.d
    const isToFullMonth = (newTDate({y:dmy.current.y,m:item.month,d:30}).day==30)  
    if ( !isToFullMonth && _d==30) 
        _d=29

    isFullMonth.current = isToFullMonth
    _setDmy({...dmy.current,d:_d,m:item.month})
  }

  const onYearSpinnerChange = (item) => {
    let _m = dmy.current.m
    if ( isLeap.current && !item.inLeapYear && _m>6 )//from leapYear to simpleYear
      _m--
    else if ( !isLeap.current && item.inLeapYear && _m>6 && _m<=12)//from to simpleYear to leapYear
      _m++
    
    isLeap.current = item.inLeapYear
    _setDmy({...dmy.current,m:_m,y:item.year})
  }  

  let flat_item
  let w1,w2
  let _rows = addPadding ? 3 : 1
  switch(size){
    case 'small':{w1=80;w2=40;flat_item=styles.small_flat_item};break;
    case 'medium':{w1=100;w2=60;flat_item=styles.medium_flat_item};break;
    case 'large':{w1=120;w2=80;flat_item=styles.large_flat_item};break;
    default: {w1=100;w2=60;flat_item=styles.medium_flat_item};break;
  }

  const getYearIndex = (year) => { 
    if ( year) {
      const index =  _years.findIndex( i=> i.year == year)
      return (index == -1) ? 1 : index
      }
    else
      return 1
  }
  
  const renderSpinners = () => { 
    return (
      <>
        <View style={{...styles.flatlist_container,borderLeftColor:'black',borderRightWidth:1}}>
          <OneSpinner
            width={w1}
            data={_years}
            index={getYearIndex(dmy.current?.y)}
            _height={flat_item._height}
            flat_item={flat_item}
            addPadding={addPadding}
            onSpinnerChange={onYearSpinnerChange}
          />
        </View>
        <View style={{...styles.flatlist_container,borderLeftColor:'black',borderRightWidth:1}}>
        {isLeap.current && <OneSpinner
              width={w1}
              data={_months_leap}
              index={(dmy.current?.m)-1 }
              _height={flat_item._height}
              flat_item={flat_item}
              addPadding={addPadding}
              onSpinnerChange={onMonthSpinnerChange}
            />}
        {!isLeap.current && <OneSpinner
              width={w1}
              data={_months}
              index={(dmy.current?.m)-1 }
              _height={flat_item._height}
              flat_item={flat_item}
              addPadding={addPadding}
              onSpinnerChange={onMonthSpinnerChange}
            />}
        </View>
        {isFullMonth.current && 
        <View style={{...styles.flatlist_container}}>
          <OneSpinner
            width={w2}
            data={_days30}
            index={dmy.current?.d-1}
            _height={flat_item._height}
            flat_item={flat_item}
            addPadding={addPadding}
            onSpinnerChange={onDaySpinnerChange}
          />
        </View>}
        {!isFullMonth.current && 
        <View style={{...styles.flatlist_container}}>
          <OneSpinner
            width={w2}
            data={_days29}
            index={dmy.current?.d-1}
            _height={flat_item._height}
            flat_item={flat_item}
            addPadding={addPadding}
            onSpinnerChange={onDaySpinnerChange}
          />
        </View>}        
      </>
    );
   }
 
  return <View style={{...styles.col_container,position:'relative',width:(w1+w1+w2),height:_rows*flat_item._height}}>
      <View style={{...styles.row_container,flex:1}}>
          {renderSpinners()}
      </View>
      {addPadding && <View style={{position:'absolute',backgroundColor:'white',height:(flat_item._height-flat_item._extraMargin),width:'100%',opacity:.4}}/>}
      {addPadding && <View style={{position:'absolute',top:(_rows*flat_item._height-flat_item._height+flat_item._extraMargin),backgroundColor:'white',height:flat_item._height-flat_item._extraMargin,width:'100%',opacity:.4}}/>}
    </View>
}

const styles = StyleSheet.create({
  col_container: {
    flexDirection: 'column',
  },
  row_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
   },
  flatlist_container: {
    height:'100%',
    backgroundColor: 'gray',
  },  
  large_flat_item: {
    fontSize:40,
    textAlign: 'center',
    paddingTop:10,
    _height:100,
    _extraMargin:10
  },
  medium_flat_item: {
    fontSize:30,
    textAlign: 'center',
    paddingTop:10,
    _height:60,
    _extraMargin:5,
  },  
  small_flat_item: {
    fontSize:20,
    textAlign: 'center',
    paddingTop:5,
    _height:40,
    _extraMargin:5,
  },   
});

// export default React.memo(HebDateSpinner)
