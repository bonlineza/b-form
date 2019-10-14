/** @format */

// @flow
import React from 'react';
/* Previous components which existed in Allianz */
import { Checkbox as Switch } from 'semantic-ui-react';
import { SingleDatePicker } from 'components/Dates';
import moment from 'moment';
/* End Previous components which existed in Allianz */

import FormInputAttachment from './FormInputAttachment';
import WYSIWYG from '../WYSIWYG';

type PropsShape = {
  setRef: (HTMLInputElement, string) => boolean,
  linkRef: (string, HTMLInputElement) => any,
  label?: string, // display value of label
  name: string, // name of input
  itemClass?: string,
  containerClass?: string,
  labelClass?: string,
  inputClass?: string,
  type?: string,
  value?: string | number | boolean,
  description?: string,
  descriptionClass?: string,
  errorFields?: { [string]: string },
  placeholder?: string,
  viewOnly: boolean,
  mandatory?: boolean,
  controlRef: Function,
  appendLeft?: string | boolean,
  inputProps?: Object,
  gridModifier?: string,
};

type StateShape = {
  hasError: boolean,
  focused: boolean,
};

class FormField extends React.Component<PropsShape, StateShape> {
  static defaultProps = {
    itemClass: '',
    labelClass: 'form__item__label',
    containerClass: '',
    inputClass: 'form__item__input',
    type: 'text',
    value: null,
    description: '',
    descriptionClass: 'form__item__description',
    errorFields: {},
    mandatory: false,
    placeholder: '',
    appendLeft: false,
    inputProps: {},
    gridModifier: '',
    label: '',
  };

  constructor(props: PropsShape) {
    super(props);
    this.state = {
      hasError: false,
      isChecked: props.type === 'switch' && props.value,
      checkLabel:
        props.type === 'switch'
          ? this.getCheckLabel(props.value, props.meta)
          : '',
      focused: false,
      value: props.value,
    };
  }

  componentDidMount() {
    this.props.controlRef(this.props.name, this.props.value || '');
  }

  componentWillReceiveProps(nextProps: PropsShape) {
    if (
      !this.state.hasError &&
      Object.keys(nextProps.errorFields).includes(this.props.name)
    ) {
      this.setError(true);
    }

    if (
      nextProps.viewOnly !== this.props.viewOnly &&
      nextProps.viewOnly === false
    ) {
      this.resetCheckedState();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.viewOnly && !this.props.viewOnly) {
      this.props.controlRef(this.props.name, this.props.value);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  getCheckLabel(value: boolean, meta: Object) {
    return meta && value ? meta.onLabel : meta.offLabel || '';
  }

  setError = (nextVal: boolean = false): any =>
    this.setState((prevState: StateShape): StateShape => ({
      ...prevState,
      hasError: nextVal,
    }));

  setStoreRef = (input: HTMLInputElement): any =>
    this.props.setRef(input, this.props.name);

  getSwitchProps = (): Object => {
    let props = {};
    if (this.props.viewOnly) {
      props = {
        ...props,
        readOnly: true,
        disabled: this.props.viewOnly,
        checked: !!this.props.value,
      };
    } else {
      props = {
        ...props,
        readOnly: false,
        checked: !!this.state.isChecked,
      };
    }
    return props;
  };

  getInput = () => {
    const props = {
      'data-qe-id': `action-input-${this.props.name}_field`,
      type: this.props.type,
      name: this.props.name,
      defaultValue: this.state.value,
      className: this.props.inputClass,
      onChange: this.changeHandler,
      placeholder: this.props.placeholder,
      id: this.props.id || this.props.name,
      ...this.props.inputProps,
    };
    if (this.props.type === 'textarea') {
      return <textarea {...props} />;
    }

    return <input {...props} />;
  };

  getGridWidth = () => {
    if (!this.props.gridWidth) {
      return this.props.description !== '' ? 'g-1/2' : 'g-1/1';
    }

    return `g-${this.props.gridWidth}`;
  };

  resetCheckedState = (): any =>
    this.setState((prevState: StateShape): StateShape => ({
      ...prevState,
      isChecked: this.props.type === 'switch' && this.props.value,
      checkLabel:
        this.props.type === 'switch'
          ? this.getCheckLabel(this.props.value, this.props.meta)
          : '',
    }));

  // eslint-disable-next-line no-unused-vars
  toggleChangeHandler = (_: any, nextToggle: Object): any => {
    this.props.controlRef(this.props.name, nextToggle.checked);
    this.setState((prevState: StateShape): StateShape => ({
      ...prevState,
      isChecked: nextToggle.checked,
      checkLabel: this.getCheckLabel(nextToggle.checked, this.props.meta),
    }));
  };

  changeHandler = (newVal: any): boolean => {
    const { value } = newVal.target;
    if (this.state.hasError) {
      this.setError();
    }

    this.props.controlRef(this.props.name, value);
    return value;
  };

  render(): React$Element<*> {
    return (
      <div className={this.props.itemClass}>
        <div
          className={`${(this.state.hasError && 'form__item--danger') ||
            'form__item '}`}>
          <div className="gw">
            <div className="g g-1/1">
              {this.props.label && (
                <label htmlFor={this.props.name} className="form__item__label">
                  {this.props.label}
                  {(!this.props.viewOnly && this.props.mandatory && '*') || ''}
                </label>
              )}
            </div>
            <div className={`g ${this.getGridWidth()}`}>
              {(this.props.type === 'switch' && (
                <Switch
                  toggle
                  ref={this.setStoreRef}
                  onChange={this.toggleChangeHandler}
                  {...this.getSwitchProps()}
                  label={this.state.checkLabel}
                />
              )) ||
                (this.props.type === 'text_editor' && (
                  <div
                    data-qe-id={`action-click-form_selector_${this.props.name}`}>
                    <WYSIWYG
                      isEditing={!this.props.viewOnly}
                      content={this.props.value || ''}
                      inputClass="form__input--wysiwyg"
                      onChange={this.props.controlRef.bind(
                        null,
                        this.props.name,
                      )}
                      setRef={this.props.setRef.bind(null, this.props.name)}
                      paragraphClass="text--dk--flushed--wysiwyg"
                      linkRef={this.props.linkRef.bind(null, this.props.name)}
                    />
                  </div>
                )) ||
                (this.props.type === 'date_selector' && (
                  <div
                    data-qe-id={`action-click-form_selector_${this.props.name}`}>
                    <SingleDatePicker
                      showClearDate
                      verticalSpacing={10}
                      hideKeyboardShortcutsPanel
                      placeholder={'CALENDAR-select_date'}
                      numberOfMonths={1}
                      displayFormat="LL"
                      date={
                        this.state.value === parseInt(this.state.value, 10)
                          ? moment.unix(this.state.value)
                          : this.state.value
                      }
                      enableOutsideDays
                      focused={this.state.focused}
                      onFocusChange={({ focused }) =>
                        this.setState({ focused })
                      }
                      isOutsideRange={(): boolean => false}
                      showBeforeTodayDifferently
                      onDateChange={(date: Object): any => {
                        this.setState({
                          value: date ? parseInt(date.format('X'), 10) : null,
                        });
                        if (this.state.hasError) this.setError();
                        this.props.controlRef(
                          this.props.name,
                          date ? parseInt(date.format('X'), 10) : null,
                        );
                      }}
                    />
                  </div>
                )) ||
                (this.props.viewOnly && (
                  <p className="text--dk--flushed">
                    {this.props.value || this.props.placeholder}
                  </p>
                )) ||
                (this.props.appendLeft && (
                  <FormInputAttachment
                    attach
                    text={this.props.appendLeft}
                    toLeft>
                    {this.getInput()}
                  </FormInputAttachment>
                )) ||
                this.getInput()}
            </div>
            {this.props.description !== '' && (
              <div className="g g-1/2">
                <div className={this.props.descriptionClass}>
                  <span>{this.props.description}</span>
                </div>
              </div>
            )}

            {this.state.hasError && (
              <div className="g g-1/1">
                <div className="form__item__validation">
                  {this.props.errorFields[this.props.name]}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default FormField;
