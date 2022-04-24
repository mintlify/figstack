import { getFigFunctionById } from '@components/app/constants';

type FunctionIconProps = {
  functionId: string;
  className: string;
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

const FunctionIcon = ({ functionId, className }: FunctionIconProps) => {
  const figFunction = getFigFunctionById(functionId);
  if (figFunction == null) return null;

  return (
    <span
      className={classNames(
        figFunction.iconBackground,
        figFunction.iconForeground,
        'rounded-sm inline-flex p-1',
      )}
    >
      <figFunction.icon className={className} aria-hidden="true" />
    </span>
  );
};

export default FunctionIcon;
