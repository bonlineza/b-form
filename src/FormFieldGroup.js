/** @format */

// @flow

import React from 'react';
// @todo - refactor architecture to support below
// import SimpleSelect from 'react-selectize/src/SimpleSelect';

import FormFieldRadioCheckbox from './FormFieldRadioCheckbox';

export type OptsShape = {
  value: string | number,
  label?: string,
  inputClass?: string,
  labelClass?: string,
};

type PropsShape = {
  type: 'checkbox' | 'radio' | 'select',
  opts: Array<OptsShape>,
  reverse?: boolean,
  group: string,
  setRef: Function,
  wrappingClass?: string,
  innerWrappingClass?: string,
  label?: string,
  placeholder?: string,
  groupTitleContainerClass?: string,
  groupTitleClass?: string,
  groupTitle?: string,
  groupSubtitle?: string,
  default?: any,
  errorFields?: { [string]: string },
  viewOnly: boolean,
  viewOptions: boolean,
  selectedValues?: Array<number | string> | boolean,
  mandatory?: boolean,
  gridWidth?: string,
  gridModifier?: string,
  defaultLabel?: string, // replaces the previous translated fallback for labels
};

type StateShape = {
  [string]: string,
  hasError: boolean,
  preselectedValues: Array<number | string>,
};

class FormFieldGroup extends React.Component<PropsShape> {
  static defaultProps = {
    wrappingClass: 'wrapping-class',
    innerWrappingClass: 'form__input-container',
    reverse: false,
    label: '',
    placeholder: null,
    groupTitleContainerClass: '',
    groupTitleClass: '',
    groupTitle: '',
    groupSubtitle: '',
    mandatory: false,
    default: false,
    errorFields: {},
    selectedValues: false,
    gridWidth: '1/1',
    gridModifier: '',
    defaultLabel: 'SELECT-placeholder',
  };

  constructor(props: PropsShape) {
    super(props);

    this.state = {
      placeholder: props.placeholder || this.props.defaultLabel,
      hasError: false,
      [props.group]:
        props.default &&
        Object.prototype.hasOwnProperty.call(props.default, 'value')
          ? props.default.value
          : '',
      preselectedValues: props.selectedValues
        ? props.opts.filter(
            (v: OptsShape): boolean =>
              props.selectedValues.includes(`${v.value}`) ||
              props.selectedValues.includes(v.value),
          )
        : [],
    };
  }

  state: StateShape;

  componentWillReceiveProps(nextProps: PropsShape): boolean {
    if (
      !this.state.hasError &&
      Object.keys(nextProps.errorFields).includes(this.props.group)
    ) {
      this.setError(true);
    }

    return true;
  }

  setError = (val: boolean = false): any =>
    this.setState((prevState: StateShape): StateShape => ({
      ...prevState,
      hasError: val,
    }));

  getRef = (input: HTMLElement): any => {
    this.props.setRef(input, this.props.group);
  };

  updateField = (input: any): any => {
    const value = input ? input.value : '';
    this.setState((prevState: StateShape): StateShape => ({
      ...prevState,
      [this.props.group]: value,
      hasError: false,
    }));
  };

  isViewOnly = (): boolean => {
    return this.props.viewOnly && !this.props.viewOptions; // only view only when options should also not be shown
  };

  render(): React$Element<*> {
    return (
      <div className={this.props.wrappingClass}>
        <div
          className={`${(this.state.hasError && 'form__item--danger') ||
            'form__item '}`}>
          <div className="gw">
            <div
              className={`g g-${this.props.gridWidth} ${this.props.gridModifier}`}>
              {this.props.groupTitle !== '' ? (
                <div className={this.props.groupTitleContainerClass}>
                  <h3 className={this.props.groupTitleClass}>
                    {this.props.groupTitle}
                  </h3>
                  {this.props.groupSubtitle !== '' ? (
                    <p>{this.props.groupSubtitle}</p>
                  ) : null}
                </div>
              ) : null}
              {(this.props.label.length && (
                <label className={this.props.labelClass} htmlFor="__">
                  {this.props.label}
                  {(!this.isViewOnly() && this.props.mandatory && '*') || ''}
                </label>
              )) ||
                null}
            </div>
            <div
              className={`g g-${this.props.gridWidth} ${this.props.gridModifier}`}>
              {(this.props.opts.length &&
                (this.props.type === 'select' ? (
                  <div>
                    {this.isViewOnly() ? (
                      <span className="text--dk--flushed">
                        {this.props.default.label}
                      </span>
                    ) : (
                      <div
                        data-qe-id={`action-click-form_selector_${this.props.name}`}>
                        {/* previously simple select*/}
                        <select
                          placeholder={this.state.placeholder}
                          defaultValue={this.props.default}
                          onChange={this.updateField}>
                          {this.props.opts.map((v: Object): Object => (
                            <option value={v.value}>{v.label}</option>
                          ))}
                        </select>
                        <span className="visuallyhidden">
                          <input
                            name={this.props.group}
                            value={this.state[this.props.group]}
                            type="text"
                            readOnly
                            ref={this.getRef}
                          />
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  (this.isViewOnly() &&
                    (this.state.preselectedValues.length > 0 ? (
                      this.state.preselectedValues.map(
                        (item: OptsShape, itemKey: number): any => (
                          <div
                            key={itemKey}
                            className={this.props.viewOnlyClass}>
                            {`${item.label}${
                              itemKey !==
                              this.state.preselectedValues.length - 1
                                ? ','
                                : ''
                            }`}
                          </div>
                        ),
                      )
                    ) : (
                      <div />
                    ))) ||
                  (this.props.opts.length && (
                    <div className="form__item__group">
                      <div className="gw--no-guts">
                        {this.props.opts.map(
                          (v: OptsShape, vk: number): React$Element<*> => (
                            <FormFieldRadioCheckbox
                              key={vk}
                              vk={vk}
                              type={this.props.type}
                              group={this.props.group}
                              innerWrappingClass={this.props.innerWrappingClass}
                              setRef={this.props.setRef}
                              inputClass={v.inputClass}
                              labelClass={v.labelClass}
                              value={v.value}
                              name={v.label}
                              reversed={this.props.reverse}
                              hasError={this.state.hasError}
                              resetError={this.setError}
                              errorFields={this.props.errorFields}
                              selectedValues={this.props.selectedValues}
                              disabled={this.props.viewOnly} // do not allow mutations if we are in view only
                            />
                          ),
                        )}
                      </div>
                    </div>
                  ))
                ))) ||
                null}
            </div>
            {this.state.hasError && (
              <div
                className={`g g-${this.props.gridWidth} ${this.props.gridModifier}`}>
                <div className="form__item__validation">
                  {this.props.errorFields[this.props.group]}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default FormFieldGroup;
