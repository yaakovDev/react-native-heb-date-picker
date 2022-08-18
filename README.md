## Still Under construction 🏗️🏗️🏗️

## A picture worth a thousand words

![Pic1](https://github.com/yaakovDev/react-native-heb-date-picker/blob/main/assets/picker-1.png)


## Some code usage

  ```

  import React,{useState} from 'react';
  import {HebDateSpinner} from 'react-native-heb-date-picker'

  const [smallDate,setSmallDate] = useState()
  const [mediumDate,setMediumDate] = useState()
  const [largeDate,setLargeDate] = useState()

  <HebDateSpinner
    size="small"
    addPadding={true}
    dmy={{d:1,m:1,y:5771}}
    onSpinnerChange={setSmallDate}
  />

  <HebDateSpinner
    size="medium"
    addPadding={false}
    year_spinner={{from:5772,to:5784}}
    dmy={{d:2,m:2,y:5772}}
    onSpinnerChange={setMediumDate}
  />

  <HebDateSpinner
    size="large"
    addPadding={true}
    dmy={{d:3,m:3,y:5773}}
    year_spinner={{from:5770,to:5784}}
    onSpinnerChange={setLargeDate}
  />
  ```

