import type {
  ComponentPropsWithoutRef,
  MouseEventHandler,
  ReactElement,
  Ref,
} from 'react';

import { isChipDevelopmentBuild } from './chip-shared.js';

export type InputChipDataAttributes = {
  [name: `data-${string}`]: string | undefined;
};

export type InputChipRootProps = Pick<
  ComponentPropsWithoutRef<'span'>,
  'className' | 'dir' | 'id' | 'lang' | 'style' | 'title'
> &
  InputChipDataAttributes;

export type InputChipBodyButtonProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  | 'aria-label'
  | 'aria-labelledby'
  | 'children'
  | 'disabled'
  | 'onClick'
  | 'ref'
  | 'type'
> & {
  type?: 'button' | 'reset' | 'submit';
} &
  InputChipDataAttributes;

export type InputChipRemoveButtonProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  | 'aria-label'
  | 'aria-labelledby'
  | 'children'
  | 'disabled'
  | 'onClick'
  | 'ref'
  | 'type'
> &
  InputChipDataAttributes;

type InputChipBodyName =
  | { 'aria-label'?: never; 'aria-labelledby'?: never }
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string };

type InputChipLeadingVisual =
  | { avatar?: never; leadingIcon?: never }
  | { avatar: ReactElement; leadingIcon?: never }
  | { avatar?: never; leadingIcon: ReactElement };

export type InputChipProps = InputChipBodyName & InputChipLeadingVisual & {
  bodyButtonProps?: InputChipBodyButtonProps;
  bodyButtonRef?: Ref<HTMLButtonElement>;
  bodyDisabled?: boolean;
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onRemove: MouseEventHandler<HTMLButtonElement>;
  removeButtonProps?: InputChipRemoveButtonProps;
  removeButtonRef?: Ref<HTMLButtonElement>;
  removeIcon: ReactElement;
  removeLabel?: string;
  rootProps?: InputChipRootProps;
  rootRef?: Ref<HTMLSpanElement>;
};

type RootPropValues = {
  className?: string | undefined;
  dir?: string | undefined;
  id?: string | undefined;
  lang?: string | undefined;
  style?: InputChipRootProps['style'] | undefined;
  title?: string | undefined;
};

type InputChipVisualProps = {
  avatar: ReactElement | undefined;
  label: string;
  leadingIcon: ReactElement | undefined;
};

function isNonEmpty(value: string | undefined): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateInputChip(
  label: string,
  onClick: MouseEventHandler<HTMLButtonElement> | undefined,
  bodyDisabled: boolean | undefined,
  ariaLabel: string | undefined,
  ariaLabelledby: string | undefined,
  removeLabel: string | undefined,
  avatar: ReactElement | undefined,
  leadingIcon: ReactElement | undefined,
): void {
  if (!isChipDevelopmentBuild()) return;

  if (!isNonEmpty(label)) {
    throw new Error('InputChip label must not be blank or whitespace-only.');
  }
  if (removeLabel !== undefined && !isNonEmpty(removeLabel)) {
    throw new Error('InputChip removeLabel must not be blank or whitespace-only.');
  }
  if (avatar !== undefined && leadingIcon !== undefined) {
    throw new Error('InputChip accepts either avatar or leadingIcon, not both.');
  }
  if (bodyDisabled && onClick === undefined) {
    throw new Error('InputChip bodyDisabled requires an onClick body action.');
  }
  if (ariaLabel !== undefined && ariaLabelledby !== undefined) {
    throw new Error('InputChip accepts either aria-label or aria-labelledby, not both.');
  }
  if (ariaLabel !== undefined && !isNonEmpty(ariaLabel)) {
    throw new Error('InputChip aria-label must not be blank or whitespace-only.');
  }
  if (ariaLabelledby !== undefined && !isNonEmpty(ariaLabelledby)) {
    throw new Error('InputChip aria-labelledby must not be blank or whitespace-only.');
  }
  if (onClick === undefined && (ariaLabel !== undefined || ariaLabelledby !== undefined)) {
    throw new Error(
      'InputChip aria-label and aria-labelledby require an onClick body action.',
    );
  }
}

function splitRootProps(rootProps: InputChipRootProps | undefined): {
  dataAttributes: InputChipDataAttributes;
  rootValues: RootPropValues;
} {
  const dataAttributes: InputChipDataAttributes = {};
  const rootValues: RootPropValues = {};

  if (rootProps === undefined) return { dataAttributes, rootValues };

  for (const [name, value] of Object.entries(rootProps)) {
    if (name.startsWith('data-') && typeof value === 'string') {
      dataAttributes[name as `data-${string}`] = value;
    }
  }

  const { className, dir, id, lang, style, title } = rootProps;
  return {
    dataAttributes,
    rootValues: { className, dir, id, lang, style, title },
  };
}

function InputChipLeadingVisual({
  avatar,
  leadingIcon,
}: Pick<InputChipVisualProps, 'avatar' | 'leadingIcon'>) {
  if (avatar !== undefined) {
    return (
      <span aria-hidden="true" className="md-input-chip__avatar">
        {avatar}
      </span>
    );
  }

  if (leadingIcon !== undefined) {
    return (
      <span aria-hidden="true" className="md-input-chip__icon">
        {leadingIcon}
      </span>
    );
  }

  return null;
}

function InputChipBodyContent({
  avatar,
  label,
  leadingIcon,
}: InputChipVisualProps) {
  return (
    <>
      <InputChipLeadingVisual avatar={avatar} leadingIcon={leadingIcon} />
      <span className="md-input-chip__label">{label}</span>
    </>
  );
}

/** A removable Material 3 InputChip with optional sibling body action. */
export function InputChip({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  avatar,
  bodyButtonProps,
  bodyButtonRef,
  bodyDisabled,
  label,
  leadingIcon,
  onClick,
  onRemove,
  removeButtonProps,
  removeButtonRef,
  removeIcon,
  removeLabel,
  rootProps,
  rootRef,
}: InputChipProps) {
  validateInputChip(
    label,
    onClick,
    bodyDisabled,
    ariaLabel,
    ariaLabelledby,
    removeLabel,
    avatar,
    leadingIcon,
  );

  const { dataAttributes, rootValues } = splitRootProps(rootProps);
  const rootClassName = rootValues.className
    ? 'md-input-chip ' + rootValues.className
    : 'md-input-chip';
  const leadingVisual = avatar !== undefined
    ? 'avatar'
    : leadingIcon !== undefined
      ? 'icon'
      : 'none';
  const resolvedRemoveLabel = removeLabel ?? 'Remove ' + label.trim();
  const bodyType = bodyButtonProps?.type ?? 'button';

  return (
    <span
      {...dataAttributes}
      className={rootClassName}
      data-leading={leadingVisual}
      dir={rootValues.dir}
      id={rootValues.id}
      lang={rootValues.lang}
      ref={rootRef}
      style={rootValues.style}
      title={rootValues.title}
    >
      {onClick !== undefined ? (
        <button
          {...bodyButtonProps}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          className={bodyButtonProps?.className
            ? 'md-input-chip__body ' + bodyButtonProps.className
            : 'md-input-chip__body'}
          disabled={bodyDisabled}
          onClick={onClick}
          ref={bodyButtonRef}
          type={bodyType}
        >
          <span className="md-input-chip__body-visual">
            <InputChipBodyContent
              avatar={avatar}
              label={label}
              leadingIcon={leadingIcon}
            />
          </span>
        </button>
      ) : (
        <span aria-hidden="true" className="md-input-chip__body-static">
          <InputChipBodyContent
            avatar={avatar}
            label={label}
            leadingIcon={leadingIcon}
          />
        </span>
      )}
      <button
        {...removeButtonProps}
        aria-label={resolvedRemoveLabel}
        className={removeButtonProps?.className
          ? 'md-input-chip__remove ' + removeButtonProps.className
          : 'md-input-chip__remove'}
        onClick={onRemove}
        ref={removeButtonRef}
        type="button"
      >
        <span className="md-input-chip__remove-visual">
          <span aria-hidden="true" className="md-input-chip__icon">
            {removeIcon}
          </span>
        </span>
      </button>
    </span>
  );
}
