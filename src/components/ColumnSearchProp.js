import { Button, Input, Space, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const getColumnSearchProps = (
  dataIndex,
  handleSearch,
  handleReset,
  searchText,
  setSearchText,
  searchedColumn,
  setSearchedColumn,
  searchInput
) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
    close,
  }) => (
    <div
      style={{
        padding: 8,
      }}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <Input
        ref={searchInput}
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0]}
        onChange={(e) =>
          setSelectedKeys(e.target.value ? [e.target.value] : [])
        }
        onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
        style={{
          marginBottom: 8,
          display: "block",
        }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{
            width: 90,
          }}
        >
          Search
        </Button>
        <Button
          onClick={() => clearFilters && handleReset(clearFilters)}
          size="small"
          style={{
            width: 90,
          }}
        >
          Reset
        </Button>
        <Button
          type="link"
          size="small"
          onClick={() => {
            confirm({
              closeDropdown: false,
            });
            setSearchText(selectedKeys[0]);
            setSearchedColumn(dataIndex);
          }}
        >
          Filter
        </Button>
        <Button
          type="link"
          size="small"
          onClick={() => {
            close();
          }}
        >
          close
        </Button>
      </Space>
    </div>
  ),

  filterIcon: (filtered) => (
    <SearchOutlined
      style={{
        color: filtered ? "#1890ff" : undefined,
      }}
    />
  ),

  onFilter: (value, record) => {
    const tagLst = record[dataIndex].map((tag) => {
      return tag.label;
    });

    for (let x = 0; x < tagLst.length; x++) {
      if (tagLst[x].toString().toLowerCase().includes(value.toLowerCase())) {
        return true;
      }
    }

    return false;
  },

  onFilterDropdownOpenChange: (visible) => {
    if (visible) {
      setTimeout(() => searchInput.current?.select(), 100);
    }
  },

  render: (text, row) => {
    return row?.labels?.map((item) => <Tag key={item.key}>{item.label}</Tag>);
  },
});

export default getColumnSearchProps;
