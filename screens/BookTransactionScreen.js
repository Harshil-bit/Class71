import React from 'react';
import { Text, View, TouchableOpacity, TextInput, Image, StyleSheet, EventEmitter, KeyboardAvoidingView, Alert } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import db from '../config.js'
export default class TransactionScreen extends React.Component {
    constructor(){
      super();
      this.state = {
        hasCameraPermissions: null,
        scanned: false,
        scannedBookId: '',
        scannedStudentId:'',
        buttonState: 'normal'
      }
    }

    getCameraPermissions = async (id) =>{
      const {status} = await Permissions.askAsync(Permissions.CAMERA);
      
      this.setState({
        /*status === "granted" is true when user has granted permission
          status === "granted" is false when user has not granted the permission
        */
        hasCameraPermissions: status === "granted",
        buttonState: id,
        scanned: false
      });
    }
checkStudentEligibilityForBookIssue=async()=>{
  const studentRef=await db.collection("students").where("studentID","==",this.state.scannedStudentId).get()
  var isStudentEligible=""
  if(studentRef.docs.length==0){
    this.setState({
      scannedStudentId:'',
      scannedBookId:''
    })
    isStudentEligible=false
    Alert.alert("The student ID does not exist in the database")

  }
  else{
    studentRef.docs.map((doc)=>{
      var student=doc.data();
    })
  }
}



    handleBarCodeScanned = async({type, data})=>{
      const {buttonState} = this.state

      if(buttonState==="BookId"){
        this.setState({
          scanned: true,
          scannedBookId: data,
          buttonState: 'normal'
        });
      }
      else if(buttonState==="normal"){
        return(
          <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
            <View>
              <image 
              source={require("../assets/booklogo.jpg")}
              style={{width:200,height:200}}
              
              />
              <Text styles={{textAlign:'center',fontSize:30}}>Issue books</Text>
            </View>
            <View style={styles.inputView}>
            <TextInput
            styles={styles.inputBox}
            placeholder="bookID"
            value={this.state.scannedBookId}
            />
            <TouchableOpacity
            style={styles.scanButton}
            onPress={()=>{
              this.getCameraPermissions("bookID")
            }}
            >
              <Text style={stlyes.buttonText}>scan</Text>

            </TouchableOpacity>
            </View>
            </KeyboardAvoidingView>
            
        )
        this.setState({
          scanned: true,
          scannedStudentId: data,
          buttonState: 'normal'
        });
      }
      
    } 
handleTransaction= async()=>{
  //Verify if the student is eligible for the issue or return of books or none
  //Student ID exists in the database
//issue: number of books issued<3
var transactionType=await this.checkBookEligibility();
if(!transactionType){
Alert.alert("The book does not exist in the library database")
this.setState({
  scannedStudentId:'',
  scannedBookId: ''
})
}
else if(transactionType==="issue"){
var isStudentEligible=await this.checkStudentEligibilityForBookIssue()
if(isStudentEligible){
this.initiateBookIssue()
Alert.alert("Book issued to the student")
}
}
else{
  var isStudentEligible=await this.checkStudentEligibilityForReturn()
  if(isStudentEligible){
this.initiateBookReturn()
Alert.alert("Book is returned to library")
  }
} 


  var transactionMessage 
db.collection("books").doc(this.state.scannedBookId).get()
.then((doc)=>{
  console.log(doc.data())
})
}



    render() {
      const hasCameraPermissions = this.state.hasCameraPermissions;
      const scanned = this.state.scanned;
      const buttonState = this.state.buttonState;

      if (buttonState !== "normal" && hasCameraPermissions){
        return(
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        );
      }

      else if (buttonState === "normal"){
        return(
          <View style={styles.container}>
            <View>
              <Image
                source={require("../assets/booklogo.jpg")}
                style={{width:200, height: 200}}/>
              <Text style={{textAlign: 'center', fontSize: 30}}>Wily</Text>
            </View>
            <View style={styles.inputView}>
            <TextInput 
              style={styles.inputBox}
              placeholder="Book Id"
              value={this.state.scannedBookId}/>
            <TouchableOpacity 
              style={styles.scanButton}
              onPress={()=>{
                this.getCameraPermissions("BookId")
              }}>
              <Text style={styles.buttonText}>Scan</Text>
            </TouchableOpacity>
            </View>
            <View style={styles.inputView}>
            <TextInput 
              style={styles.inputBox}
              placeholder="Student Id"
              value={this.state.scannedStudentId}/>
            <TouchableOpacity 
              style={styles.scanButton}
              onPress={()=>{
                this.getCameraPermissions("StudentId")
              }}>
              <Text style={styles.buttonText}>Scan</Text>
            </TouchableOpacity>
            </View>
          </View>
        );
      }
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    displayText:{
      fontSize: 15,
      textDecorationLine: 'underline'
    },
    scanButton:{
      backgroundColor: '#2196F3',
      padding: 10,
      margin: 10
    },
    buttonText:{
      fontSize: 15,
      textAlign: 'center',
      marginTop: 10
    },
    inputView:{
      flexDirection: 'row',
      margin: 20
    },
    inputBox:{
      width: 200,
      height: 40,
      borderWidth: 1.5,
      borderRightWidth: 0,
      fontSize: 20
    },
    scanButton:{
      backgroundColor: '#66BB6A',
      width: 50,
      borderWidth: 1.5,
      borderLeftWidth: 0
    }
  });