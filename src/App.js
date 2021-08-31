import React, {Component, PureComponent} from 'react';

class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      texts: [],
      loading: false,
      pageNo: 0,
      query: ""
    }
  } 

  componentDidMount(){
    const { pageNo } = this.state;
    this.getRandomText(pageNo)
    let observer;
    let options = {
      root:null,
      rootMargin: '0px',

    }
    // this.observer = new IntersectionObserver(this.handlePageObserver.bind(this), options)
    
    
    observer = new IntersectionObserver(this.handlePageObserver.bind(this), options);
    observer.observe(this.loadingRef);
  }

  handlePageObserver(entity){
    console.log('this.state.texts', this.state.texts);
    const { previousPage, texts} = this.state;
    const y = entity[0].boundingClientRect.y;
    console.log('y', y);
    if(previousPage > y){
      console.log('hey', texts)
      const lastText = texts.length - 1;
      this.getRandomText(lastText)
    }
    this.setState({ previousPage: y })
  }

  getRandomText = (pageNo) => {
    this.setState({ loading: true });
    const apiUrl = `http://openlibrary.org/search.json?q=the+lord+of+the+rings&${pageNo}&limit=5`;
    fetch(apiUrl).then(response => response.json())
    .then(data => {
      this.setState({ texts: data })
      this.setState({  loading: false})
      console.log('data', data);
    })
  }


  render(){
    const { texts, query, loading } = this.state;
    const textObject  = texts && texts.docs;
    console.log('textObject', textObject);
    const loadingCss = {
      height: "100px",
      margin: "30px"
    }
    console.log('loading', loading)
    return(
      <>
      {
          loading ? <h1>Loading...</h1>: 
          <div>
        <input type="text" value={query} onChange={this.handleChange} />

       {
         textObject && textObject.map(item => {
           console.log('item', item)
           return(
             <div>
               {item.text.map(displayText => {
                 return(
                   <h5>{displayText}</h5>
                 )
               })}
              </div> 
           )
         })
       }
       <div ref={loadingRef => (this.loadingRef = loadingRef)} style={loadingCss}>

       </div>
      </div>
      }
      </>
      
    )
  }
}

export default App;