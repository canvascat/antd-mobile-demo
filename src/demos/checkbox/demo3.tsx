import { useRef } from "react";
import type { FC, PropsWithChildren } from "react";
import { Checkbox, CheckboxRef, List } from "antd-mobile";
import { DemoBlock } from "demos";

const items = ["Apple", "Orange", "Banana"];

const ListItemWithCheckbox: FC<
  PropsWithChildren<{
    item: string;
  }>
> = (props) => {
  const checkboxRef = useRef<CheckboxRef>(null);
  return (
    <List.Item
      prefix={
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox value={props.item} ref={checkboxRef} />
        </div>
      }
      onClick={() => {
        checkboxRef.current?.toggle();
      }}
      arrow={false}
    >
      {props.item}
    </List.Item>
  );
};

export default () => {
  return (
    <>
      <DemoBlock title="配合 List 使用" padding="0">
        <Checkbox.Group>
          <List>
            {items.map((item) => (
              <ListItemWithCheckbox key={item} item={item} />
            ))}
          </List>
        </Checkbox.Group>
      </DemoBlock>
    </>
  );
};
