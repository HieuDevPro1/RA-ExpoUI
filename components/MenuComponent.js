import React, { Component } from 'react';
import { FlatList, View, Text } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';

import * as Animatable from 'react-native-animatable';

import Loading from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
// redux
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    dishes: state.dishes
  }
};
class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animationKey: 1,
    };

    this.focusListener = this.props.navigation.addListener("focus", () => {
      // Update the state to change the key and force re-render
      this.setState({ animationKey: this.state.animationKey + 1 });
    });
  }

  render() {
    if (this.props.dishes.isLoading) {
      return (<Loading />);
    } else if (this.props.dishes.errMess) {
      return (<Text>{this.props.errMess}</Text>);
    } else {
      return (
        <FlatList data={this.props.dishes.dishes}
          renderItem={({ item, index }) => this.renderMenuItem(item, index)}
          keyExtractor={(item) => item.id.toString()} />
      );
    }
  }
  renderMenuItem(item, index) {
    const { navigate } = this.props.navigation;
    return (
      <Animatable.View key={this.state.animationKey} animation='fadeInRightBig' duration={2000}>
        <ListItem key={index} onPress={() => navigate('Dishdetail', { dishId: item.id })}>
          <Avatar source={{uri: baseUrl + item.image}} />
          <ListItem.Content>
            <ListItem.Title>{item.name}</ListItem.Title>
            <ListItem.Subtitle>{item.description}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      </Animatable.View>
    );
  }
}

export default connect(mapStateToProps)(Menu);