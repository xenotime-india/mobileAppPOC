import React, { Component } from 'react';
import {
  Container,
  Header,
  Content,
  Form,
  Item,
  Input,
  Label,
  Icon
} from 'native-base';
import { StyleSheet, Picker } from 'react-native';
export default class NewMeetup extends Component {
  state = {
    selected: 'key1'
  };
  onValueChange(value) {
    this.setState({
      selected: value
    });
  }
  render() {
    return (
      <Container>
        <Content>
          <Form>
            <Item floatingLabel>
              <Label style={styles.label}>Meetup Name</Label>
              <Input style={styles.text} />
            </Item>
            <Item picker>
              <Picker
                mode="dropdown"
                iosIcon={
                  <Icon
                    name="arrow-down"
                    style={{ color: '#4b5487', fontSize: 12 }}
                  />
                }
                placeholder="Select Meetup Type"
                placeholderIconColor="#4b5487"
                placeholderStyle={{ color: '#4b5487', fontSize: 12 }}
                style={{ ...styles.text, width: undefined }}
                selectedValue={this.state.selected}
                onValueChange={this.onValueChange.bind(this)}
              >
                <Picker.Item label="Wallet" value="key0" />
                <Picker.Item label="ATM Card" value="key1" />
                <Picker.Item label="Debit Card" value="key2" />
                <Picker.Item label="Credit Card" value="key3" />
                <Picker.Item label="Net Banking" value="key4" />
              </Picker>
            </Item>
            <Item floatingLabel>
              <Label style={styles.label}>Meetup Duration</Label>
              <Input style={styles.text} />
            </Item>
            <Item floatingLabel>
              <Label style={styles.label}>Is Active</Label>
              <Input style={styles.text} />
            </Item>
            <Item floatingLabel>
              <Label style={styles.label}>Max Attendees</Label>
              <Input style={styles.text} />
            </Item>
          </Form>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  label: {
    color: '#4b5487',
    fontSize: 14,
    lineHeight: 24
  },
  text: {
    color: '#4b5487',
    fontSize: 12,
    lineHeight: 14
  }
});
