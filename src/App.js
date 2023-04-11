import {
  EditableProTable,
  ProCard,
  ProFormField,
  ProFormRadio,
} from "@ant-design/pro-components";
import { Popconfirm, Input } from "antd";
import getColumnSearchProps from "./components/ColumnSearchProp";
import TagList from "./components/TagList";
import React, { useState, useRef } from "react";
import "./App.css";

const waitTime = (time = 20) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

// Date processing function

const processDate = (date) => {
  const parts = date.split("-");
  return new Date(parts[2], parts[1] - 1, parts[0]);
};

// const defaultData = [
//   {
//     id: 624748504,
//     title: "title 1",
//     readonly: "true",
//     decs: "decs",
//     state: "open",
//     created_at: "1590486176000",
//     update_at: "1590486176000",
//   },
//   {
//     id: 624691229,
//     title: "title 2",
//     readonly: "flase",
//     decs: "decs",
//     state: "closed",
//     created_at: "1590481162000",
//     update_at: "1590481162000",
//   },
// ];

function App() {
  const [editableKeys, setEditableRowKeys] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [position, setPosition] = useState("bottom");

  // search hook
  const [searchedLabel, setSearchedLabel] = useState("");

  // search prop hooks
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  // search prop helper functions
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  // timestamp configurations and functions

  const timestampSorterConfig = {
    compare: (a, b) => {
      const date1 = a.timestamp.split(" ")[0];
      const date2 = b.timestamp.split(" ")[0];

      const time1 = a.timestamp.split(" ")[2];
      const time2 = b.timestamp.split(" ")[2];

      if (date1 === date2) {
        return time1 > time2;
      } else {
        return processDate(date1) > processDate(date2);
      }
    },
  };

  const timestampOnFilterFunc = (value, record) => {
    let tagFind = false;

    const tagLst = record?.labels?.map((tag) => {
      return tag.label;
    });

    for (let x = 0; x < tagLst?.length; x++) {
      if (tagLst[x].toString().toLowerCase().includes(value.toLowerCase())) {
        tagFind = true;
      }
    }

    return (
      record.timestamp?.toUpperCase().includes(value?.toUpperCase()) ||
      record.title?.toUpperCase().includes(value?.toUpperCase()) ||
      record.description?.toUpperCase().includes(value?.toUpperCase()) ||
      record.due_date?.toUpperCase().includes(value?.toUpperCase()) ||
      record.status?.toUpperCase().includes(value?.toUpperCase()) ||
      tagFind
    );
  };

  // status configurations and functions

  const statusValueEnumConfig = {
    open: {
      text: "Open",
      status: "Warning",
    },
    working: {
      text: "Working",
      status: "Default",
    },
    done: {
      text: "Done",
      status: "Success",
    },
    overdue: {
      text: "Overdue",
      status: "Error",
    },
  };

  const statusFilters = [
    {
      text: "Open",
      value: "Open",
    },
    {
      text: "Working",
      value: "Working",
    },
    {
      text: "Done",
      value: "Done",
    },
    {
      text: "Overdue",
      value: "Overdue",
    },
  ];

  // options configurations

  const optionsRenderFunct = (text, record, _, action) => [
    <a
      key="editable"
      onClick={() => {
        action?.startEditable?.(record.id);
      }}
    >
      Edit
    </a>,
    dataSource.length >= 1 ? (
      <Popconfirm
        title="Sure to delete?"
        onConfirm={() => {
          setDataSource(dataSource.filter((item) => item.id !== record.id));
        }}
      >
        <a key="delete">Delete</a>
      </Popconfirm>
    ) : null,
  ];

  // Table columns defination and configurations

  const columns = [
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      tooltip: "Timestamp at which a task was created",
      width: "12%",
      readonly: true,
      formItemProps: {
        rules: [
          {
            required: true,
          },
        ],
      },
      sorter: timestampSorterConfig,
      sortDirections: ["descend", "ascend"],
      filteredValue: searchedLabel ? [searchedLabel] : undefined,
      onFilter: timestampOnFilterFunc,
    },
    {
      title: "Title",
      dataIndex: "title",
      tooltip: "Title of the task to be done",
      width: "15%",
      formItemProps: {
        rules: [
          {
            max: 100,
            required: true,
            whitespace: true,
          },
        ],
      },
      sorter: {
        compare: (a, b) => {
          return a.title.localeCompare(b.title);
        },
      },
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Description",
      dataIndex: "description",
      tooltip: "Description of the task to be done",
      width: "20%",
      formItemProps: {
        rules: [
          {
            max: 1000,
            // required: true,
            whitespace: true,
          },
        ],
      },
      sorter: {
        compare: (a, b) => {
          return a.description.localeCompare(b.description);
        },
      },
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Due Date",
      dataIndex: "due_date",
      tooltip: "Expected due date to finish the task",
      valueType: "date",
      sorter: {
        compare: (a, b) => {
          return processDate(a.due_date) > processDate(b.due_date);
        },
      },
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Tag",
      dataIndex: "labels",
      tooltip: "Tags on each task",
      renderFormItem: (_, { isEditable }) => {
        return isEditable ? <TagList /> : <Input />;
      },
      ...getColumnSearchProps(
        "labels",
        handleSearch,
        handleReset,
        searchText,
        setSearchText,
        searchedColumn,
        setSearchedColumn,
        searchInput
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      tooltip: "Shows status of a task",
      valueType: "select",
      valueEnum: statusValueEnumConfig,
      formItemProps: {
        rules: [
          {
            // required: true,
          },
        ],
      },
      filters: statusFilters,
      onFilter: (value, record) => {
        return record.status?.toUpperCase() === value.toUpperCase();
      },
    },
    {
      title: "",
      valueType: "option",
      width: 200,
      render: optionsRenderFunct,
    },
  ];

  // EditableProTable configurations and functions

  const recordCreatorConfig = {
    position: position,
    style: {
      width: "25%",
      left: "50%",
      transform: "translateX(-50%)",
    },
    record: () => {
      const currentdate = new Date();

      const date =
        (currentdate.getDate() < 10 ? "0" : "") + currentdate.getDate();

      const month =
        (currentdate.getMonth() + 1 < 10 ? "0" : "") +
        (currentdate.getMonth() + 1);
      const hours =
        (currentdate.getHours() < 10 ? "0" : "") + currentdate.getHours();
      const minutes =
        (currentdate.getMinutes() < 10 ? "0" : "") + currentdate.getMinutes();
      const seconds =
        (currentdate.getSeconds() < 10 ? "0" : "") + currentdate.getSeconds();

      const datetime =
        date +
        "-" +
        month +
        "-" +
        currentdate.getFullYear() +
        "  " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds;
      return {
        id: (Math.random() * 1000000).toFixed(0),
        timestamp: datetime,
      };
    },
  };

  const toolBarFunct = () => [
    <ProFormRadio.Group
      key="render"
      fieldProps={{
        value: position,
        onChange: (e) => setPosition(e.target.value),
      }}
      options={[
        {
          label: "top",
          value: "top",
        },
        {
          label: "bottom",
          value: "bottom",
        },
        {
          label: "hidden",
          value: "hidden",
        },
      ]}
    />,
  ];

  return (
    <>
      <Input.Search
        placeholder="Search ..."
        style={{
          width: "25%",
          marginBottom: "20px",
        }}
        onSearch={(value) => {
          setSearchedLabel(value);
        }}
      />
      <EditableProTable
        rowKey="id"
        headerTitle="Todos"
        scroll={{
          x: 960,
        }}
        recordCreatorProps={position !== "hidden" ? recordCreatorConfig : false}
        loading={false}
        toolBarRender={toolBarFunct}
        columns={columns}
        // request={async () => ({
        //   data: dataSource,
        //   total: 30,
        //   success: true,
        // })}
        value={dataSource}
        onChange={setDataSource}
        editable={{
          type: "multiple",
          editableKeys,
          onSave: async (rowKey, data, row) => {
            console.log(rowKey, data, row);
            await waitTime(500);
          },
          onChange: setEditableRowKeys,
        }}
        pagination={{
          style: {
            margin: "40px 20px",
          },
          pageSize: 10,
          position: ["bottomCenter"],
          total: dataSource.length,
        }}
      />

      <ProCard title="card" headerBordered collapsible defaultCollapsed>
        <ProFormField
          ignoreFormItem
          fieldProps={{
            style: {
              width: "100%",
            },
          }}
          mode="read"
          valueType="jsonCode"
          text={JSON.stringify(dataSource)}
        />
      </ProCard>
    </>
  );
}

export default App;
