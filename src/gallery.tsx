import { useEffect, useLayoutEffect, useState } from "react";
import {
  List,
  NavBar,
  Popover,
  Popup,
  SafeArea,
  SearchBar,
  Space,
} from "antd-mobile";
import styles from "./gallery.module.less";
import { useDebounceEffect } from "ahooks";
import { cloneDeep } from "lodash-es";
import { ComponentGroup, components } from "./config";
import { Link, useParams } from "react-router";
import classNames from "classnames";
import { AppstoreOutline, UnorderedListOutline } from "antd-mobile-icons";

const componentToDemoPaths: Record<string, string[]> = {};
const componentToTitle: Record<string, string> = {};

components.forEach((group) => {
  group.children.forEach((item) => {
    const key = item.path.split("/").slice(-1)[0];
    componentToDemoPaths[key] = item.children;
    componentToTitle[key] = item.title;
  });
});

export default function Gallery() {
  const [visible, setVisible] = useState(false);
  const [currentDemoIndex, setCurrentDemoIndex] = useState<number | null>(null);
  const [currentComponent, setCurrentComponent] = useState("");
  const [title, setTitle] = useState("Ant Design Mobile");
  const [searchValue, setSearchValue] = useState<string>("");
  const [componentGroups, setComponentGroups] = useState(() => components);
  const params = useParams();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useLayoutEffect(() => {
    const component = params.component || "";
    setVisible(false);
    setCurrentComponent(component);
    setTitle(componentToTitle[component] || "Ant Design Mobile");
  }, [params.component]);

  useLayoutEffect(() => {
    if (!currentComponent) {
      setCurrentDemoIndex(null);
    } else {
      setCurrentDemoIndex(0);
    }
  }, [currentComponent]);

  useDebounceEffect(
    () => {
      const filterGroups = cloneDeep(components);
      filterGroups.forEach((group) => {
        group.children = group.children.filter((item) =>
          item.title.toLowerCase().includes(searchValue.toLowerCase())
        );
      });
      setComponentGroups(filterGroups.filter((group) => group.children.length));
    },
    [searchValue],
    {
      wait: 200,
      leading: false,
      trailing: true,
    }
  );

  const demoSwitcher = currentComponent && currentDemoIndex !== null && (
    <Popover.Menu
      trigger="click"
      placement="bottomRight"
      actions={componentToDemoPaths[currentComponent].map((_, index) => ({
        text: `Demo${index + 1}`,
        onClick: () => {
          setCurrentDemoIndex(index);
        },
      }))}
    >
      <a className={styles.demoSwitcher}>
        {currentDemoIndex + 1} / {componentToDemoPaths[currentComponent].length}
      </a>
    </Popover.Menu>
  );

  const renderList = (componentGroups: ComponentGroup[]) =>
    componentGroups.map((group) => {
      return (
        <List key={group.title} header={group.title}>
          {group.children.map((item) => {
            const demoPaths = item.children;
            if (demoPaths.length === 0) return null;
            return (
              <Link key={item.path} to={`/${demoPaths[0]}`}>
                <List.Item>{item.title}</List.Item>
              </Link>
            );
          })}
        </List>
      );
    });

  return (
    <div style={{ height: window.innerHeight }} className={styles.gallery}>
      <div className={styles.header}>
        <NavBar
          backIcon={currentDemoIndex !== null && <UnorderedListOutline />}
          onBack={() => setVisible(true)}
          right={demoSwitcher}
        >
          {title}
        </NavBar>
      </div>
      {currentComponent && currentDemoIndex !== null && (
        <div className={classNames(styles.body, styles.demoBody)}>
          <iframe
            src={
              "/~demos/" +
              componentToDemoPaths[currentComponent][currentDemoIndex]
            }
            style={{
              width: window.innerWidth,
              height: "100%",
              border: "none",
            }}
          />
        </div>
      )}
      <div className={styles.body} hidden={currentDemoIndex !== null}>
        <div className={styles.guide}>
          <img
            src="https://gw.alipayobjects.com/zos/bmw-prod/b874caa9-4458-412a-9ac6-a61486180a62.svg"
            alt="logo"
            className={styles.logo}
          />
          <p>下面是一些 Ant Design Mobile 的组件 demo，可以点进去试一试</p>
        </div>
        <div className={styles.search}>
          <SearchBar
            placeholder="搜索组件"
            value={searchValue}
            onChange={(val) => setSearchValue(val)}
          />
        </div>

        <Popup
          visible={visible}
          onMaskClick={() => setVisible(false)}
          position="left"
          bodyStyle={{ width: "60vw" }}
        >
          <div style={{ height: "100%", overflowY: "auto" }}>
            <List>
              <Link to="/">
                <List.Item>
                  <Space>
                    <AppstoreOutline />
                    <span>首页</span>
                  </Space>
                </List.Item>
              </Link>
            </List>
            {renderList(components)}
          </div>
        </Popup>

        {renderList(componentGroups)}
        <SafeArea position="bottom" />
      </div>
    </div>
  );
}
