import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Keyboard,
  Modal
} from 'react-native';
import { TextField } from 'react-native-material-textfield';
import debounce from 'lodash/debounce';
import { Icon } from 'native-base';
import { haveDependentFormValuesChanged } from './Form.helpers';
import CheckBox from './../CheckBox';

const initialState = {
  selectedValue: null,
  loading: true,
  options: [],
  optionsSource: [],
  error: null,
  query: '',
  text: '',
  modalVisible: false
};

export default class AutoCompletePopup extends React.Component {
  mounted = true;
  state = initialState;

  componentWillUnmount() {
    this.mounted = false;
  }
  reset = (showModal = false) => {
    const { defaultValue, fieldName, onValueChange } = this.props;
    this.onChangeText('');
    this.setState(({ optionsSource }) => ({
      ...initialState,
      selectedValue: defaultValue,
      loading: false,
      optionsSource,
      query: defaultValue,
      modalVisible: showModal
    }));

    if (onValueChange) {
      onValueChange({ label: null, value: null });
    }
  };

  getSelectedValue = (formValues = {}) => {
    const { defaultValue, fieldName } = this.props;
    return formValues[fieldName]
      ? formValues[fieldName] || formValues[fieldName].value
      : defaultValue;
  };

  bindData = async (props, resetSelectedValue = false) => {
    const {
      query,
      options,
      formValues,
      fieldName,
      defaultValue,
      onValueChange,
      checkAppIsReady,
      isLocalSearch,
      filters
    } = props;
    let selectedValue = this.getSelectedValue(formValues);
    if (resetSelectedValue) {
      onValueChange(defaultValue || { label: null, value: null });
      selectedValue = defaultValue || null;
    }
    if (!query) {
      if (this.mounted)
        this.setState({
          selectedValue,
          loading: false,
          optionsSource: options,
          query: selectedValue
        });
      return;
    }

    try {
      let text = '';
      if (defaultValue && typeof defaultValue === 'string') {
        text = defaultValue.toLowerCase();
      } else if (defaultValue) {
        text = defaultValue;
      }

      let results = null;
      let rows = [];
      results = await query.source(text);
      rows = results.map(row => {
        let output = {};
        const label = row[query.labelField];
        output.label = label;
        output.value = query.valueField ? row[query.valueField] : row;
        if (defaultValue === label) output.checked = true;
        return output;
      });

      if (selectedValue) {
        const selected = rows.filter(item => item.label === selectedValue);
        if (selected && selected.length > 0) props.onValueChange(selected[0]);
      }
      if (checkAppIsReady) checkAppIsReady(fieldName);

      let state = {
        selectedValue,
        loading: false,
        optionsSource: rows,
        query: selectedValue
      };

      if (this.mounted) this.setState(state);
    } catch (error) {
      console.log(`Error ${error}`);
      if (this.mounted)
        this.setState({
          optionsSource: [],
          options: [],
          query: '',
          loading: false,
          error
        });
    }
  };

  async componentDidMount() {
    await this.bindData(this.props);
    this.focus = this.onOpenClosePress;
  }

  async componentWillReceiveProps(nextProps) {
    const { isFormEditable, options } = this.props;
    const { value, callService } = nextProps;

    let dropdownBecameEditable = !isFormEditable && nextProps.isFormEditable,
      areOptionsChanged;

    areOptionsChanged =
      options && nextProps.options && options.length < nextProps.options.length;

    if (dropdownBecameEditable || areOptionsChanged || callService) {
      await this.bindData(nextProps);
    }

    let state = { text: value, query: value };
    if (!value) {
      state.options = [];
      state.optionsSource = [];
      state.selectedValue = null;
    }
    this.setState(state);
  }

  findOptions = query => {
    try {
      if (query === '' || !query) {
        return [];
      }
      const { optionsSource } = this.state;
      const regex = new RegExp(`${query.trim()}`, 'i');
      return optionsSource.filter(option => option.label.search(regex) >= 0);
    } catch (error) {
      console.log(error);
    }
  };

  bindSearchResults = debounce(async text => {
    const { mode, query } = this.props;
    let options = [];
    if (mode !== 'lazy') {
      options = this.findOptions(text);
    } else {
      if (!text || text === '') {
        this.setState({ options, query: text, text });
        return;
      }
      let results = await query.source(text);
      options = results.map(item => {
        return {
          label: item[query.labelField],
          value: query.valueField ? item[query.valueField] : item
        };
      });
    }

    if (this.mounted)
      this.setState({ query: text, options, loading: false, text });
  }, 300);

  onChangeText = (text = '') => {
    this.setState({
      loading: text && text !== '',
      text
    });

    this.bindSearchResults(text);
  };

  onOpenClosePress = () => {
    if (this.state.modalVisible) Keyboard.dismiss();
    this.setState(({ modalVisible }) => ({ modalVisible: !modalVisible }));
  };

  onDonePress = () => {
    this.setState(
      ({ modalVisible, options }) => ({
        modalVisible: !modalVisible,
        optionsSource: [...options]
      }),
      () => {
        const { onValueChange, fieldName, singleSelection } = this.props;
        const { options } = this.state;

        if (onValueChange) {
          const selected = options.filter(item => item.checked);
          if (singleSelection && selected.length > 0)
            onValueChange(selected[0]);
          else onValueChange(selected);
        }
      }
    );
  };

  onCheckBoxClick = item => () => {
    const { singleSelection } = this.props;

    this.setState(
      ({ options }) => ({
        options: options.map(option => {
          if (option.value === item.value) {
            option = Object.assign({}, option, { checked: !option.checked });
          } else if (singleSelection) {
            option = Object.assign({}, option, { checked: false });
          }
          return option;
        })
      }),
      () => {
        if (singleSelection) {
          this.onDonePress();
        }
      }
    );
  };

  __renderSearchModal = (
    title,
    isFieldValueEditable,
    placeholder,
    titleComp
  ) => {
    const { modalVisible, query, options, loading } = this.state;
    const { warningMessages, singleSelection } = this.props;
    const optionIsSelected = (a, b) => false;
    let renderItems = [];
    try {
      renderItems = options
        ? options.length === 1 &&
          optionIsSelected(query || '', options[0].label || '')
          ? []
          : [...options].slice(0, 20)
        : [];
    } catch (ex) {
      console.log(`Error ${ex}`);
    }

    let finalValue = query || '';
    finalValue = typeof finalValue === 'object' ? finalValue.label : finalValue;

    return (
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        supportedOrientations={[
          'portrait',
          'portrait-upside-down',
          'landscape',
          'landscape-left',
          'landscape-right'
        ]}
      >
        <View
          style={[
            styles.modalView,
            {
              padding: 0,
              backgroundColor: '#fafafa'
            }
          ]}
        >
          <View
            style={[
              styles.modalViewInside,
              {
                width: '100%',
                paddingVertical: 5
              }
            ]}
          >
            <View
              style={{
                flex: 1,
                maxHeight: 30,
                marginHorizontal: 0
              }}
            >
              <TouchableOpacity
                onPress={this.onOpenClosePress}
                style={styles.closeIconContainer}
              >
                <Icon name="close" size={24} style={{ color: '#4b5487' }} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalHeaderView}>
              <Text style={[styles.pickerActiveLblText]}>{titleComp}</Text>
              {title && (
                <Text
                  style={[
                    styles.pickerActiveLblText,
                    {
                      color: '#4b5487',
                      textAlign: 'left',
                      fontSize: 12,
                      fontWeight: 'bold'
                    }
                  ]}
                >
                  {title}
                </Text>
              )}
              <TextInput
                style={[
                  styles.pickerView,
                  { paddingLeft: 10, paddingRight: 35 }
                ]}
                placeholder={placeholder}
                autoCorrect={false}
                onChangeText={this.onChangeText}
                blurOnSubmit={false}
                value={finalValue}
                autoFocus
              />
              <TouchableOpacity
                onPress={() => this.reset(true)}
                style={styles.searchIconContainer}
                disabled={!isFieldValueEditable}
              >
                <Icon name="close" size={24} style={{ color: '#4b5487' }} />
              </TouchableOpacity>
            </View>
            {warningMessages && options.length > 100 && (
              <Text style={[styles.inputTitleHintWarning]}>
                {warningMessages}
              </Text>
            )}

            <View style={styles.bottomViewontainer}>
              <ScrollView
                contentContainerStyle={styles.scrollViewContainer}
                keyboardShouldPersistTaps="handled"
                onScroll={event => {
                  Keyboard.dismiss();
                }}
              >
                <View>
                  {loading && isFieldValueEditable && (
                    <ActivityIndicator size="small" />
                  )}
                  {renderItems &&
                    renderItems.map((item, index) => (
                      <View key={index} style={styles.renderItemList}>
                        <CheckBox
                          style={styles.checkboxItem}
                          onClick={this.onCheckBoxClick(item)}
                          isChecked={item.checked}
                          leftText={item.label}
                          singleSelection
                          size={25}
                          hideCheckBox
                          boldFont
                        />
                      </View>
                    ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  _renderSelectedIcon = item => (
    <View style={[styles.selectedItem]} key={item.value}>
      <Text style={[styles.selectedItemText]} numberOfLines={1}>
        {item.label}
      </Text>
    </View>
  );

  renderBase = selectedLabels => {
    let { selectedDate } = this.state;
    let { renderAccessory = this.renderAccessory, mode } = this.props;

    return (
      <TextField
        label=""
        {...this.props}
        value={selectedLabels}
        editable={false}
        onChangeText={undefined}
        renderAccessory={renderAccessory}
      />
    );
  };
  renderAccessory = () => {
    let { baseColor: backgroundColor } = this.props;
    let triangleStyle = { backgroundColor };

    return (
      <View style={styles.accessory}>
        <View style={styles.triangleContainer}>
          <View style={[styles.triangle, triangleStyle]} />
        </View>
      </View>
    );
  };
  render() {
    const {
      placeholder,
      label,
      titleComp,
      placement,
      listTopOffset,
      isFieldValueEditable = true,
      isFormEditable,
      value
    } = this.props;

    const { optionsSource } = this.state;

    let listStyle =
      placement && placement === 'bottom'
        ? { ...styles.listBottomStyle }
        : { ...styles.listStyle };

    if (listTopOffset) {
      listStyle.top = listTopOffset;
    }

    let finalValue = value || '';
    finalValue = typeof finalValue === 'object' ? finalValue.label : finalValue;

    const selectedLabels = optionsSource.find(item => item.checked);
    if (selectedLabels) {
      finalValue =
        typeof selectedLabels === 'object'
          ? selectedLabels.label
          : selectedLabels;
    }

    return (
      <View style={styles.container} ref={ref => (this.view = ref)}>
        <TouchableWithoutFeedback
          onPress={isFormEditable ? this.onOpenClosePress : null}
        >
          <View pointerEvents="box-only">{this.renderBase(finalValue)}</View>
        </TouchableWithoutFeedback>

        {this.__renderSearchModal(
          label,
          isFieldValueEditable,
          placeholder,
          titleComp
        )}
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1
  },
  autocompleteContainer: {},
  itemText: {
    color: '#4b5487',
    fontSize: 15,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    marginBottom: 10
  },
  listContainerStyle: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 1.0
  },
  listStyle: { position: 'absolute', left: 0, top: 0, zIndex: 99999 },
  listBottomStyle: { position: 'absolute', left: 0, bottom: 40, zIndex: 99999 },
  sepraterStyle: { backgroundColor: '#000', height: 0.5 },
  inputTitleHintWarning: {
    color: '#FF0000',
    fontSize: 13,
    minHeight: 18,
    height: 'auto',
    marginTop: 5,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    marginHorizontal: 16
  },
  modal: {
    margin: 0
  },
  modalView: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 30,
    alignItems: 'center'
  },
  modalViewInside: {
    backgroundColor: '#fafafa',
    width: 650,
    paddingVertical: 16,
    flex: 1
  },
  text: {
    color: '#3f2949'
  },
  pickerView: {
    width: '100%',
    flexDirection: 'row',
    borderColor: '#4b5487',
    backgroundColor: '#FFFFFF',
    color: '#4b5487',
    borderWidth: 1,
    borderRadius: 2,
    padding: 1,
    alignItems: 'center',
    minHeight: 36
  },
  pickerLblText: {
    color: '#B2B4AE',
    fontSize: 15
  },
  pickerActiveLblText: {
    marginBottom: 5,

    width: '100%'
  },
  pickerIcon: { position: 'absolute', right: 0, margin: 5 },
  disableText: {
    color: '#ADADAD'
  },
  disableInput: {
    borderColor: '#E2E2E2',
    backgroundColor: '#FAFAFA'
  },
  modalHeaderView: {
    marginHorizontal: 16,
    maxWidth: 500,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
    width: '100%'
  },
  closeIconContainer: {
    width: 30,
    height: 30,
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4b5487',
    borderRadius: 2,
    marginTop: 3
  },
  searchIconContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 3,
    bottom: 3
  },
  checkboxItem: {
    paddingVertical: 15
  },
  selectedItem: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 1,
    width: '85%',
    flexDirection: 'row'
  },
  selectedItemText: {
    flex: 1,
    color: '#000000',
    fontSize: 13,
    marginLeft: 8
  },
  bottomViewontainer: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 10,
    marginHorizontal: 16,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%'
  },
  scrollViewContainer: {
    flexGrow: 1,
    paddingHorizontal: 6
  },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingTop: 10
  },
  cancelButton: {
    height: 36,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#4b5487',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100
  },
  doneButton: {
    height: 36,
    backgroundColor: '#F9B13C',
    borderRadius: 2,
    marginLeft: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4b5487'
  },
  renderItemList: {
    borderColor: '#dddddd',
    borderBottomWidth: 1
  },
  accessory: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },

  triangle: {
    width: 8,
    height: 8,
    transform: [
      {
        translateY: -4
      },
      {
        rotate: '45deg'
      }
    ]
  },

  triangleContainer: {
    width: 12,
    height: 6,
    overflow: 'hidden',
    alignItems: 'center',

    backgroundColor: 'transparent' /* XXX: Required */
  },

  overlay: {
    ...StyleSheet.absoluteFillObject
  },

  item: {
    textAlign: 'left'
  },

  scroll: {
    flex: 1,
    borderRadius: 2
  },

  scrollContainer: {
    paddingVertical: 8
  }
};
