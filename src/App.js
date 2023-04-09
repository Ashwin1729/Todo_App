import {
  EditableProTable,
  ProCard,
  ProFormField,
  ProFormRadio,
} from "@ant-design/pro-components";
import { Popconfirm, Space, Tag, Input } from "antd";
import getColumnSearchProps from "./components/ColumnSearchProp";
import React, { useState, useRef } from "react";
import "./App.css";

const waitTime = (time = 20) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const processDate = (date) => {
  const parts = date.split("-");
  return new Date(parts[2], parts[1] - 1, parts[0]);
};

const TagList = ({ value, onChange }) => {
  const ref = useRef(null);
  const [newTags, setNewTags] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    let tempsTags = [...(value || [])];
    if (
      inputValue &&
      tempsTags.filter((tag) => tag.label === inputValue).length === 0
    ) {
      tempsTags = [
        ...tempsTags,
        { key: `new-${tempsTags.length}`, label: inputValue },
      ];
    }
    onChange?.(tempsTags);
    setNewTags([]);
    setInputValue("");
  };

  return (
    <Space>
      {(value || []).concat(newTags).map((item) => (
        <Tag key={item.key}>{item.label}</Tag>
      ))}
      <Input
        ref={ref}
        type="text"
        size="small"
        style={{ width: 78 }}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputConfirm}
        onPressEnter={handleInputConfirm}
      />
    </Space>
  );
};

const defaultData = [
  // {
  //   id: 624748504,
  //   title: "title 1",
  //   readonly: "true",
  //   decs: "decs",
  //   state: "open",
  //   created_at: "1590486176000",
  //   update_at: "1590486176000",
  // },
  // {
  //   id: 624691229,
  //   title: "title 2",
  //   readonly: "flase",
  //   decs: "decs",
  //   state: "closed",
  //   created_at: "1590481162000",
  //   update_at: "1590481162000",
  // },
];

function App() {
  const [editableKeys, setEditableRowKeys] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [position, setPosition] = useState("bottom");
  // const [lables, setLables] = useState([]);

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
      sorter: {
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
      },
      sortDirections: ["descend", "ascend"],
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
      valueEnum: {
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
      },
      formItemProps: {
        rules: [
          {
            // required: true,
          },
        ],
      },
      filters: [
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
      ],
      onFilter: (value, record) => {
        return record.status.toUpperCase() === value.toUpperCase();
      },
    },
    {
      title: "",
      valueType: "option",
      width: 200,
      render: (text, record, _, action) => [
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
      ],
    },
  ];

  return (
    <>
      <EditableProTable
        rowKey="id"
        headerTitle="Todos"
        scroll={{
          x: 960,
        }}
        recordCreatorProps={
          position !== "hidden"
            ? {
                position: position,
                record: () => {
                  const currentdate = new Date();

                  const date =
                    (currentdate.getDate() < 10 ? "0" : "") +
                    currentdate.getDate();

                  const month =
                    (currentdate.getMonth() + 1 < 10 ? "0" : "") +
                    (currentdate.getMonth() + 1);
                  const hours =
                    (currentdate.getHours() < 10 ? "0" : "") +
                    currentdate.getHours();
                  const minutes =
                    (currentdate.getMinutes() < 10 ? "0" : "") +
                    currentdate.getMinutes();
                  const seconds =
                    (currentdate.getSeconds() < 10 ? "0" : "") +
                    currentdate.getSeconds();

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
              }
            : false
        }
        loading={false}
        toolBarRender={() => [
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
        ]}
        columns={columns}
        request={async () => ({
          data: dataSource,
          total: 30,
          success: true,
        })}
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
        // search={{ searchText: "Search", labelWidth: "auto" }}
        pagination={{
          pageSize: 10,
          // position: ["bottomCenter"],
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
