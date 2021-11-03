import React from 'react';
import { ScrollView, FlatList, Text, View } from 'react-native';
import db from '../config'
export default class Searchscreen extends React.Component {
  constructor(props){
super(props)
this.state={allTransactions:[],
lastVisibleTransaction:null
}
  }
fetchMoreTransaction=async()=>{
  const query=await db.collection("transactions").startAfter(this.state.lastVisibleTransaction).limit(10).get()
query.docs.map((doc)=>{
  this.setState({
    allTransactions: [...this.state.allTransactions,doc.data()],
    lastVisibleTransaction:doc
  })
})
}
componentDidMount=async()=>{
const query=await db.collection("transactions").get()
query.docs.map((doc)=>{
  this.setState({
    allTransactions:[...this.state.allTransactions,doc.data()]
  })
})
}
    render() {
      return (
        <FlatList
        data={this.state.allTransactions}
        renderItem={({item})=>(
<View style={{borderBottomWidth:2}}>
                <Text>{"Book ID: " + transaction.bookId}</Text>
                <Text>{"Student ID: " + transaction.studentId}</Text>
                <Text>{"Transaction Type:" + transaction.transactionType}</Text>
                <Text>{"Date:" + transaction.date.toDate()}</Text>
              </View>
        )}
    keyExtractor={(item,index)=>index.toString()}
    onEndReached={
      this.fetchMoreTransaction
    }
    onEndReachedThreshold={0.7}
        />
      );
    }
  }