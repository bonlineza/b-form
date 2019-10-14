/** @format */

// @flow
import React, { Fragment } from 'react';

type PropsShape = {
  attach: boolean,
  text?: string,
  children?: any, // the form input
  toLeft?: boolean,
  viewOnly?: boolean,
};

const FormInputAttachment = ({
  attach = false,
  text = '',
  children,
  toLeft = false,
  viewOnly = false,
}: PropsShape): React$Element<*> => (
  <Fragment>
    {attach ? (
      <span
        className={`form__input--attach-container${toLeft ? '--left' : ''}`}>
        <Fragment>
          {children}
          <span className="form__input-attachment">
            {!viewOnly ? text : ''}
          </span>
        </Fragment>
      </span>
    ) : (
      <Fragment>{children}</Fragment>
    )}
  </Fragment>
);

FormInputAttachment.defaultProps = {
  text: '',
  children: [],
  toLeft: false,
  viewOnly: false,
};

export default FormInputAttachment;
