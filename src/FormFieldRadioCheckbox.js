/** @format */

// @flow

import React from 'react';

type PropsShape = {
  renderLabel?: Function, // replaces previous generateLink
  reversed: boolean,
  type: string,
  inputClass: string,
  group: string,
  value: string | number,
  vk: number,
  setRef: Function,
  labelClass?: string,
  name: string,
  innerWrappingClass: string,
  resetError: Function,
  hasError: boolean,
  selectedValues?: any,
  disabled: boolean,
};

type StateShape = {};

class RadioCheckbox extends React.Component<PropsShape, StateShape> {
  static defaultProps = {
    labelClass: '',
    selectedValues: false,
    disabled: false,
  };

  constructor(props: PropsShape) {
    super(props);
    this.state = {};
  }

  linkRef = (ref: HTMLElement): any =>
    this.props.setRef(ref, `${this.props.group}-${this.props.vk}`);

  changeHandler = (): any => {
    if (this.props.disabled) return null;
    return this.props.hasError ? this.props.resetError() : null;
  };

  generateInput = (): React$Element<*> => (
    <input
      type={this.props.type}
      onChange={this.changeHandler}
      className={`${
        this.props.inputClass !== undefined
          ? this.props.inputClass
          : 'input-class'
      } ${
        this.props.hasError ||
        Object.keys(this.props.errorFields).includes(this.props.group)
          ? 'form__input-container--error'
          : ''
      }`}
      name={this.props.group}
      value={this.props.value}
      id={`${this.props.group}-${this.props.vk}`}
      data-qe-id={`choice-${this.props.group}-${this.props.vk}`}
      ref={this.linkRef}
      disabled={this.props.disabled}
      defaultChecked={
        this.props.selectedValues &&
        (this.props.selectedValues.includes(`${this.props.value}`) ||
          this.props.selectedValues.includes(this.props.value) ||
          this.props.selectedValues === this.props.value)
      }
    />
  );

  generateLabel = (): React$Element<*> =>
    typeof this.props.renderLabel === 'function' ? (
      this.props.renderLabel()
    ) : (
      <label
        className={
          this.props.labelClass !== undefined
            ? this.props.labelClass
            : 'label-class'
        }
        htmlFor={`${this.props.group}-${this.props.vk}`}>
        {this.props.name}
      </label>
    );

  render(): React$Element<*> {
    return (
      <span className={this.props.innerWrappingClass}>
        {this.props.reversed ? this.generateInput() : this.generateLabel()}
        {this.props.reversed ? this.generateLabel() : this.generateInput()}
      </span>
    );
  }
}

export default RadioCheckbox;
