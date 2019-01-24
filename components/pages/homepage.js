import React, { Component } from 'react';
import { Platform, StyleSheet, View, Dimensions} from 'react-native';
import { Actions } from 'react-native-router-flux';
import store, { URI } from '../../store'
import { getDoctorsConditions } from '../../utils/api'
import {
  Container,
  Header,
  Content,
  Footer,
  FooterTab,
  Button,
  Icon,
  Text,
  Left,
  Right,
  Body,
  Spinner,
} from 'native-base'

import FooterMenu from '../elements/FooterMenu'

export default class Homepage extends Component {
  constructor(props) {
  super(props);
  this.state = {
    doctorsConditions: store.getState().doctorsConditions,
    isLoading: true,
    userID: store.getState().user.id,
    userName: store.getState().user.fname,
  }
}

//Subscribe doctorsConditions state to the store to update on change
async componentDidMount(){
  this.unsubscribe = store.onChange(() => {
    this.setState({
      doctorsConditions: store.getState().doctorsConditions,
      userID: store.getState().user.id
    })
  })
//Get the conditions from the doctors_conditions route
  let conditions = []
  conditions = await getDoctorsConditions()
//Set the store state with the conditions. This should cause local state to update and re-render
  store.setState({
    doctorsConditions: conditions,
  })
  this.setState({
    isLoading: false,
  })
}

componentWillUnmount(){
  //disconnect from store notifications
  this.unsubscribe()
}

  render() {
    //Show loading spinner if fetching data
    return (
      <Container>
        <Header>
          <Left>
            <Text>Hello {this.state.userName}</Text>
          </Left>
          <Body>
          </Body>
          <Right>
            <Button
              onPress={() => { Actions.ConditionsLibrary() }}
            >
              <Text>Conditions</Text>
            </Button>
          </Right>
        </Header>
        <Content>
          <Text style={styles.title}>Selected Conditions</Text>
          { //Check if state is loading to show spinner
            (this.state.isLoading)
            ? <Spinner color='red' />
            : this.state.doctorsConditions.map((condition, idx) => (
              <Button key={idx} conditionId={condition.id} rounded style={styles.button}>
                <Text>{condition.name}</Text>
              </Button>
            ))
          }
        </Content>
        <Footer>
          <FooterMenu/>
        </Footer>
      </Container>
      ) // End of return

  } // End of render

} // End of componenet

// Variables to changes the height and width dynamically for all screens
const height = Dimensions.get('window').height
const width = Dimensions.get('window').width

// Put styles in here to format the page
const styles = StyleSheet.create({
    button: {
      margin: 15,
      width: '80%',
    },
    title: {
      fontSize: 40,
      margin: 10,
    },
    spinner: {
      height: height
    }
});
