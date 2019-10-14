// @flow

type getRefsType = () => Array<
  | {
      name: string,
      input: HTMLInputElement,
    }
  | *,
>;

type RefFuncTypeReturn = {
  setRef: (HTMLInputElement, string) => boolean,
  getRefs: getRefsType,
  addRef: (string, string) => boolean,
};

export default (): RefFuncTypeReturn => {
  const refs = [];
  return {
    // DEPRECATION NOTICE - 1 June 2018 |> use linkRef //
    setRef(input: HTMLInputElement, name: string): boolean {
      refs.push({ name, input });
      return true;
    },

    // DEPRECATION NOTICE - 1 June 2018 |> use controlRef//
    addRef(name: string, value: string): boolean {
      refs.push({ name, value });
      return true;
    },

    getRefs(): Array<*> {
      return refs;
    },

    linkRef(name: string, input: HTMLInputElement): boolean {
      const index = refs.findIndex(
        (item: Object): boolean => item.name === name,
      );

      if (index !== -1) {
        refs.splice(index, 1);
        refs.push({ name, input });
      } else {
        refs.push({ name, input });
      }
      return refs;
    },

    controlRef(name: string, value: string): Array<*> {
      const index = refs.findIndex(
        (item: Object): boolean => item.name === name,
      );
      if (index !== -1) {
        refs.splice(index, 1);
        refs.push({ name, value });
      } else {
        refs.push({ name, value });
      }
      return refs;
    },

    batchUpdate(items) {
      items.forEach(item => {
        const { name, value } = item;

        const index = refs.findIndex(
          (ref: Object): boolean => ref.name === name,
        );
        if (index !== -1) {
          refs.splice(index, 1);
          refs.push({ name, value });
        } else {
          refs.push({ name, value });
        }
        return item;
      });
      return refs;
    },
  };
};
