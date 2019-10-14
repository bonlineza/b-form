/** @format */

// @flow
import React, { Fragment } from 'react';

import FormFieldGroup from './FormFieldGroup';
import FormField from './FormField';
import type { OptsShape } from './FormFieldGroup';
import sanitizeStore from './helpers/sanitizeStore.js';
import handleRef from './helpers/handleRef';

type ErrorShape = {
  result: boolean,
  fields?: Array<{
    [string]: string,
  }>,
};

type FormPropsFieldsType = {
  id: string,
  name: string,
  label?: string,
  type?: string,
  value?: string | number | boolean,
  selectedValues?: Array<string | number>,
  options?: Array<OptsShape>, // required for type checkbox | radio
  containerClass?: string,
  itemClass?: string,
  groupTitleContainerClass?: string,
  groupTitleClass?: string,
  groupTitle?: string,
  component?: Function,
  placeholder?: string,
  appendLeft?: string | boolean,
  default?: {
    value: string | number,
    label: string,
  },
  renderFooter?: Function | void, // over ride container for footer
};

type DefaultPropsShape = {
  validateBefore: Function,
};

type PropsShape = {
  scrollToTop?: Function, // @todo deprecate
  // eslint-disable-next-line react/no-unused-prop-types
  submitAct: Function,
  // eslint-disable-next-line react/no-unused-prop-types
  cancelAct?: Function | boolean,
  wrappingClass?: string,
  // eslint-disable-next-line react/no-unused-prop-types
  wrappingOuterClass?: string,
  validateBefore?: Object => ErrorShape,
  Before?: any,
  After?: any,
  sections: Array<{
    title?: string,
    sectionClass?: string,
    fields: Array<FormPropsFieldsType>,
  }>,
  afterSubmitErrors?: Object, // some errors js can't catch
  viewOnly?: boolean, // display the form in a view mode
  viewOptions?: boolean, // when in viewOnly mode, show the options from form groups instead of hiding them
  isProcessing?: boolean,
  submitButtonLocaleKey?: string,
  customActions?: Function | void,
};

type StateShape = {
  errors: ErrorShape,
};

class Form extends React.Component<DefaultPropsShape, PropsShape> {
  static defaultProps = {
    scrollToTop: null,
    validateBefore: (): Object => ({ result: true }),
    afterSubmitErrors: {},
    viewOnly: false,
    viewOptions: false,
    wrappingClass: '',
    wrappingOuterClass: '',
    Before() {
      return null;
    },
    After() {
      return null;
    },
    cancelAct: false,
    isProcessing: false,
    submitButtonLocaleKey: 'submit',
    customActions: null,
  };

  static getDerivedStateFromProps(nextProps) {
    if (Object.keys(nextProps.afterSubmitErrors).length > 0) {
      return {
        errors: nextProps.afterSubmitErrors,
      };
    }
    return null;
  }

  constructor(props: PropsShape) {
    super(props);
    this.state = {
      errors: {},
    };
    this.formFieldGroupTypes = ['checkbox', 'radio', 'select'];
  }

  state: StateShape;

  componentDidUpdate(prevProps, prevState) {
    if (
      Object.keys(prevState.errors).length === 0 &&
      Object.keys(this.state.errors).length > 0
    ) {
      this.scrollToTop();
    }
  }

  setErrors = (errors: ErrorShape): any => {
    this.setState((prevState: StateShape) => ({
      ...prevState,
      errors,
    }));
  };

  getBefore = (): React$Element<*> => {
    // this is unnecessary
    const { Before } = this.props;

    return <Before setRef={this.refStore.setRef} />;
  };

  getAfter = (): React$Element<*> => {
    // this is unnecessary
    const { After } = this.props;

    return <After setRef={this.refStore.setRef} />;
  };

  getFooterActions = () => {
    let actions = [];
    if (this.props.viewOnly) return actions;

    if (this.props.cancelAct) {
      actions = [
        ...actions,
        {
          attrs: {
            type: 'button',
            'data-qe-id': 'action-cancel-form',
            className: 'btn--base--transp',
          },
          label: 'JOB-ACTIONS-BACK',
          name: 'cancel-form',
          action: e => {
            e.preventDefault();
            this.props.cancelAct();
          },
        },
      ];
    }
    actions = [
      ...actions,
      {
        name: 'submit',
        attrs: {
          type: 'submit',
          disabled: this.props.isProcessing,
          'data-qe-id': 'action-submit-form',
          className: 'btn--primary',
        },
        label: this.props.isProcessing
          ? 'RESULT-loading'
          : this.props.submitButtonLocaleKey,
      },
    ];

    return actions;
  };

  getFooter = () => {
    if (this.props.viewOnly) return null;

    return (
      <Fragment>
        <Fragment>
          {this.props.cancelAct && (
            <div className="fl-right__item">
              <button
                type="button"
                className="btn--text"
                onClick={e => {
                  e.preventDefault();
                  this.props.cancelAct();
                }}>
                {l('JOB-ACTIONS-BACK')}
              </button>
            </div>
          )}
        </Fragment>
        <Fragment>
          {typeof this.props.customActions === 'function'
            ? this.props.customActions()
            : null}
        </Fragment>
        <div className="fl-right__item">
          <button
            disabled={this.props.isProcessing}
            type="submit"
            className="btn--primary"
            data-qe-id="action-submit-form">
            {this.props.isProcessing
              ? l('RESULT-loading')
              : l(this.props.submitButtonLocaleKey)}
          </button>
        </div>
      </Fragment>
    );
  };

  getFieldType = item => {
    switch (true) {
      case this.formFieldGroupTypes.includes(item.type):
        return (
          <FormFieldGroup
            errorFields={this.state.errors}
            viewOnly={this.props.viewOnly}
            viewOptions={this.props.viewOptions}
            key={item.id}
            setRef={this.refStore.setRef}
            addRef={this.refStore.addRef}
            opts={item.options}
            group={item.name}
            innerWrappingClass={item.innerClass}
            {...item}
          />
        );
      case item.type === 'component':
        return item.component({
          label: item.label,
          setRef: this.refStore.setRef,
          addRef: this.refStore.addRef,
          batchUpdate: this.refStore.batchUpdate,
          controlRef: this.refStore.controlRef,
          key: item.id || item.name,
          viewOnly: this.props.viewOnly,
          linkRef: this.refStore.linkRef,
          hasError: Object.prototype.hasOwnProperty.call(
            this.state.errors,
            item.name,
          ),
          ...item,
          errors: this.state.errors,
        });
      default:
        return (
          <FormField
            linkRef={this.refStore.linkRef}
            setRef={this.refStore.setRef}
            viewOnly={this.props.viewOnly}
            errorFields={this.state.errors}
            key={item.id || item.name}
            controlRef={this.refStore.controlRef}
            {...item}
          />
        );
    }
  };

  scrollToTop = (): any => {
    if (this.props.scrollToTop) {
      this.props.scrollToTop();
    }
  };

  refStore = handleRef();

  submitHandler = (e: Event, store: Array<*>, cb: any => any): Object => {
    e.preventDefault();

    const payload = sanitizeStore(store);
    const validation = this.props.validateBefore
      ? this.props.validateBefore(payload)
      : { result: false };

    return validation.result
      ? this.payloadValidated(payload, cb)
      : this.setErrors(validation.fields);
  };

  payloadValidated = (payload: Object, cb: Function): any => {
    this.clearErrors({});
    return cb(payload, this.setErrors);
  };

  clearErrors = (): any =>
    this.setState(
      (prevState: StateShape): StateShape => ({
        ...prevState,
        errors: {},
      }),
    );

  render(): React$Element<*> {
    return (
      <form
        noValidate
        onSubmit={(e: Event): Object =>
          this.submitHandler(e, this.refStore.getRefs(), this.props.submitAct)
        }>
        <div className={this.props.wrappingOuterClass}>
          {this.getBefore()}

          {this.props.sections.map(
            (sect: any, key: number): React$Element<*> => (
              <div
                key={key}
                className={sect.sectionClass ? sect.sectionClass : ''}>
                {sect.title && (
                  <div>
                    <h1 className="form__section__title">{l(sect.title)}</h1>
                  </div>
                )}
                {sect.subtitle && <p className="">{l(sect.subtitle)}</p>}
                <div className={this.props.wrappingClass}>
                  {sect.fields.map(
                    (
                      item: FormPropsFieldsType,
                      key2: number,
                    ): React$Element<*> => (
                      <Fragment key={key2}>{this.getFieldType(item)}</Fragment>
                    ),
                  )}
                </div>
              </div>
            ),
          )}
        </div>

        {this.getAfter()}

        {this.props.renderFooter ? (
          <React.Fragment>
            {this.props.renderFooter(this.getFooterActions())}
          </React.Fragment>
        ) : (
          <div className="fl-right">{this.getFooter()}</div>
        )}
      </form>
    );
  }
}

export default Form;
