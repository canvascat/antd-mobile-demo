import { useEffect, useMemo, useState } from "react";
import { Cascader, Button, CascaderOption } from "antd-mobile";
import { DemoBlock, sleep } from "demos";
import { CheckListValue } from "antd-mobile/es/components/check-list";

function AsyncLoadDataDemo() {
  const [visible, setVisible] = useState(false);
  const [valueToOptions, setValueToOptions] = useState(
    {} as Record<string, CascaderOption[] | null>
  );
  const options = useMemo<CascaderOption[]>(() => {
    function generate(v: string | undefined): CascaderOption[] | undefined {
      if (v === undefined) return undefined;
      const options = valueToOptions[v];
      if (options === null) {
        return undefined;
      }
      if (options === undefined) {
        return Cascader.optionSkeleton;
      }
      return options.map((option) => ({
        ...option,
        children: generate(option.value),
      }));
    }
    return generate("") ?? [];
  }, [valueToOptions]);

  async function fetchOptionsForValue(v: CheckListValue, level: number) {
    if (v in valueToOptions) return;
    if (level >= 3) {
      setValueToOptions((prev) => ({
        ...prev,
        [v]: null,
      }));
      return;
    }
    const data = await mockDataFetch(v);
    const options =
      data === null
        ? null
        : data.map((entry) => ({
            value: entry,
            label: entry,
          }));
    setValueToOptions((prev) => ({
      ...prev,
      [v]: options,
    }));
  }

  useEffect(() => {
    fetchOptionsForValue("", 0);
  }, []);

  return (
    <>
      <Button
        onClick={() => {
          setVisible(true);
        }}
      >
        选择
      </Button>
      <Cascader
        options={options}
        onSelect={(value) => {
          value.forEach((v, index) => {
            fetchOptionsForValue(v, index + 1);
          });
        }}
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
      />
    </>
  );
}

async function mockDataFetch(value: CheckListValue) {
  await sleep(1000);
  return Array(5)
    .fill(null)
    .map((_, index) => (value ? `${value}-${index + 1}` : `选项 ${index + 1}`));
}

export default () => {
  return (
    <>
      <DemoBlock title="异步加载数据">
        <AsyncLoadDataDemo />
      </DemoBlock>
    </>
  );
};
