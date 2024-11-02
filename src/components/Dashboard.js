import { useEffect, useState } from "react"
import Papa from 'papaparse';
import csvFile from '../assets/evdata.csv';
import { Button, Input, Space, Table } from 'antd';
import { Col, Row, Spinner } from "reactstrap";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, XAxis, YAxis, Bar, ScatterChart, ZAxis, Scatter, LineChart, Line, AreaChart, Area, RadarChart, Radar, FunnelChart, Funnel } from 'recharts';
import { Select } from 'antd';
const { Option } = Select;

const Dashboard = () => {
    const [csvData, setCsvData] = useState([])
    const [loading, setLoading] = useState(true)
    const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    const [selectedField, setSelectedField] = useState('County');

    const vehicleData = [
        "VIN (1-10)",
        "County",
        "City",
        "State",
        "Postal Code",
        "Model Year",
        "Make",
        "Model",
        "Electric Vehicle Type",
        "Clean Alternative Fuel Vehicle (CAFV) Eligibility",
        "Electric Range",
        "Base MSRP",
        "Legislative District",
        "DOL Vehicle ID",
        "Vehicle Location",
        "Electric Utility",
        "2020 Census Tract"
    ]

    const pieChartOptions = [
        "County",
        "City",
        "State",
        "Postal Code",
        "Model Year",
        "Make",
        "Model",
        "Electric Vehicle Type",
        "Clean Alternative Fuel Vehicle (CAFV) Eligibility",
        "Electric Range",
        "Base MSRP",
        "Legislative District",
        "Electric Utility",
    ]

    const columns = [
        {
            title: 'Serial No.',
            dataIndex: 'serialNo',
            key: 'serialNo',
            render: (text, record, index) => <div className="text-center">{index + 1}</div>, // Calculate the serial number
        },
        {
            title: 'VIN (1-10)',
            dataIndex: 'VIN (1-10)',
            key: 'vin',
            sorter: (a, b) => a['VIN (1-10)'].localeCompare(b['VIN (1-10)']),
        },
        {
            title: 'County',
            dataIndex: 'County',
            key: 'county',
            sorter: (a, b) => a?.County?.localeCompare(b?.County),
        },
        {
            title: 'City',
            dataIndex: 'City',
            key: 'city',
            sorter: (a, b) => a?.City?.localeCompare(b?.City),
        },
        {
            title: 'State',
            dataIndex: 'State',
            key: 'state',
            sorter: (a, b) => a?.State?.localeCompare(b?.State),
        },
        {
            title: 'Postal Code',
            dataIndex: 'Postal Code',
            key: 'postalCode',
            sorter: (a, b) => a['Postal Code'] - b['Postal Code'],
        },
        {
            title: 'Model Year',
            dataIndex: 'Model Year',
            key: 'modelYear',
            sorter: (a, b) => a['Model Year'] - b['Model Year'],
        },
        {
            title: 'Make',
            dataIndex: 'Make',
            key: 'make',
            sorter: (a, b) => a?.Make?.localeCompare(b?.Make),
        },
        {
            title: 'Model',
            dataIndex: 'Model',
            key: 'model',
            sorter: (a, b) => a?.Model?.localeCompare(b?.Model),
        },
        {
            title: 'Electric Vehicle Type',
            dataIndex: 'Electric Vehicle Type',
            key: 'electricVehicleType',
            sorter: (a, b) => a['Electric Vehicle Type']?.localeCompare(b['Electric Vehicle Type']),
        },
        {
            title: 'CAFV Eligibility',
            dataIndex: 'Clean Alternative Fuel Vehicle (CAFV) Eligibility',
            key: 'cafvEligibility',
            sorter: (a, b) => a['Clean Alternative Fuel Vehicle (CAFV) Eligibility']?.localeCompare(b['Clean Alternative Fuel Vehicle (CAFV) Eligibility']),
        },
        {
            title: 'Electric Range',
            dataIndex: 'Electric Range',
            key: 'electricRange',
            sorter: (a, b) => a['Electric Range'] - b['Electric Range'],
        },
        {
            title: 'Base MSRP',
            dataIndex: 'Base MSRP',
            key: 'baseMSRP',
            sorter: (a, b) => a['Base MSRP'] - b['Base MSRP'],
        },
        {
            title: 'Legislative District',
            dataIndex: 'Legislative District',
            key: 'legislativeDistrict',
            sorter: (a, b) => a['Legislative District'] - b['Legislative District'],
        },
        {
            title: 'DOL Vehicle ID',
            dataIndex: 'DOL Vehicle ID',
            key: 'dolVehicleID',
            sorter: (a, b) => a['DOL Vehicle ID']?.localeCompare(b['DOL Vehicle ID']),
        },
        {
            title: 'Vehicle Location',
            dataIndex: 'Vehicle Location',
            key: 'vehicleLocation',
        },
        {
            title: 'Electric Utility',
            dataIndex: 'Electric Utility',
            key: 'electricUtility',
            sorter: (a, b) => a['Electric Utility']?.localeCompare(b['Electric Utility']),
        },
        {
            title: '2020 Census Tract',
            dataIndex: '2020 Census Tract',
            key: 'censusTract',
            sorter: (a, b) => a['2020 Census Tract'] - b['2020 Census Tract'],
        },
    ];

    const getPieChartData = () => {
        let data = csvData?.reduce((acc, curr) => {
            const keyValue = curr[selectedField];
            const existing = acc.find(item => item.name === keyValue);
            if (existing) {
                existing.value += 1;
            } else {
                acc.push({ name: keyValue, value: 1 });
            }
            return acc;
        }, []);

        data = data?.sort((a, b) => a?.name?.localeCompare(b?.name))

        return data;
    };

    const getInsights = () => {
        if (csvData?.length === 0) {
            return []
        }

        let fieldData = pieChartOptions?.map((el) => {
            let allInsights = []
            let fieldValues = csvData?.reduce((acc, curr) => {
                const keyValue = curr[el];
                const existing = acc.find(item => item.name === keyValue);
                if (existing) {
                    existing.value += 1;
                } else {
                    acc.push({ name: keyValue, value: 1 });
                }
                return acc;
            }, []);

            let mostCommonValue = findObjectWithHighestValue(fieldValues, "value")
            let mostUncommonValue = findObjectWithLowestValue(fieldValues, "value")

            allInsights.push(
                <>
                    Most Common value for {el} is <span className="greenText">{mostCommonValue?.name}</span> with {mostCommonValue?.value} entries.
                </>
            )
            allInsights.push(
                <>
                    Most Uncommon value for {el} is <span className="redText">{mostUncommonValue?.name}</span> with {mostUncommonValue?.value} entries.
                </>
            )
            return {
                label: el,
                insights: allInsights,
            }
        })

        return fieldData;
    };

    const findObjectWithHighestValue = (data, key) => {
        return data.reduce((maxObj, currentObj) => {
            return (parseInt(currentObj[key]) > parseInt(maxObj[key])) ? currentObj : maxObj;
        });
    };

    const findObjectWithLowestValue = (data, key) => {
        return data.reduce((maxObj, currentObj) => {
            return (parseInt(currentObj[key]) < parseInt(maxObj[key])) ? currentObj : maxObj;
        });
    };

    const readCSVData = async () => {
        const response = await fetch(csvFile);
        const text = await response.text();

        Papa.parse(text, {
            header: true,
            complete: (results) => {
                setCsvData(results?.data);
                setLoading(false)
            },
            error: (error) => {
                console.error("Error parsing CSV file:", error);
            },
        });
    }

    useEffect(() => {
        readCSVData();
    }, [])

    const pieChartData = getPieChartData();
    const insights = getInsights();

    return (
        <div className="rightDiv">
            <h3 className="text-center text-white m-3 p-3 text-decoration-underline" >Electric Vehicle Data Representation</h3>
            <h5 className="mx-4 text-white d-flex justify-content-between">
                <div>1. Tablular Data</div>
                <div>Total Records: {csvData?.length}</div>
            </h5>
            <div className="card d-flex justify-content-center align-items-center" >
                {loading ? (
                    <>
                        <Spinner className="m-3 p-3"></Spinner>
                    </>
                ) : (
                    <Table
                        dataSource={csvData}
                        scroll={{ x: 'max-content' }} // Horizontal scroll if needed 
                        columns={columns}
                        pagination={true}
                        rowClassName="table-row"
                    />
                )}
            </div>
            <h5 className="mx-4 text-white d-flex justify-content-between mt-5">
                <div>2. Chart Data</div>
                <div className="text-end">
                    <h6 className="text-white">Select Field for Chart Representation</h6>
                    <Select
                        defaultValue={selectedField}
                        style={{ width: 200 }}
                        onChange={value => setSelectedField(value)}
                        className="text-center"
                    >
                        {pieChartOptions?.map(option => (
                            <Option key={option} value={option}>
                                {option}
                            </Option>
                        ))}
                    </Select>
                </div>
            </h5>
            <Row style={{ padding: '20px' }}>
                <Col md={6} className="mb-4">
                    <ResponsiveContainer width="100%" height={400}
                    >
                        {loading ? (
                            <div className="text-center">
                                <Spinner className="m-3 p-3"></Spinner>
                            </div>
                        ) : (
                            <PieChart>
                                <Tooltip />
                                {/* <Legend /> */}
                                <Pie
                                    data={pieChartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={150}
                                >
                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        )}
                        <h5 className="text-center text-white">Pie Chart</h5>
                    </ResponsiveContainer>
                </Col>
                <Col md={6} className="mb-4">
                    <ResponsiveContainer width="100%" height={400}>
                        {loading ? (
                            <div className="text-center">
                                <Spinner className="m-3 p-3"></Spinner>
                            </div>
                        ) : (
                            <BarChart data={pieChartData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#8884d8" />
                            </BarChart>
                        )}
                        <h5 className="text-center text-white">Bar Chart</h5>
                    </ResponsiveContainer>
                </Col>
                <Col md={6} className="mb-4">
                    <ResponsiveContainer width="100%" height={400}>
                        {loading ? (
                            <div className="text-center">
                                <Spinner className="m-3 p-3"></Spinner>
                            </div>
                        ) : (
                            <LineChart data={pieChartData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="value" stroke="#8884d8" />
                            </LineChart>
                        )}

                        <h5 className="text-center text-white">Line Chart</h5>
                    </ResponsiveContainer>
                </Col>
                <Col md={6} className="mb-4">
                    <ResponsiveContainer width="100%" height={400}>
                        {loading ? (
                            <div className="text-center">
                                <Spinner className="m-3 p-3"></Spinner>
                            </div>
                        ) : (
                            <AreaChart data={pieChartData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={0.3} fill="#8884d8" />
                            </AreaChart>
                        )}

                        <h5 className="text-center text-white">Area Chart</h5>
                    </ResponsiveContainer>
                </Col>
                {/* <Col md={6} className="mb-4">
                    <ResponsiveContainer width="100%" height={400}>
                        <RadarChart outerRadius={90} data={pieChartData}>
                            <Radar name={selectedField} dataKey="safety" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                            <Tooltip />
                        </RadarChart>
                        <h5 className="text-center text-white">Radar Chart</h5>
                    </ResponsiveContainer>
                </Col> */}
                <Col md={6} className="mb-4">
                    <ResponsiveContainer width="100%" height={400}>
                        {loading ? (
                            <div className="text-center">
                                <Spinner className="m-3 p-3"></Spinner>
                            </div>
                        ) : (
                            <FunnelChart>
                                <Funnel data={pieChartData} dataKey="value" name={selectedField} stroke="#8884d8" fill="#8884d8" />
                                <Tooltip />
                            </FunnelChart>
                        )}

                        <h5 className="text-center text-white">Funnel Chart</h5>
                    </ResponsiveContainer>
                </Col>
            </Row>
            <h5 className="mx-4 text-white mt-5">
                <div className="mb-4">3. Insights</div>
                <Row>
                    {loading ? (
                        <div className="text-center">
                            <Spinner className="m-3 p-3"></Spinner>
                        </div>
                    ) : (
                        <>
                            {insights?.map((insight, index) => (
                                <Col md={5} className="insight-card ">
                                    <div className="mb-3 text-center text-decoration-underline">{insight?.label}</div>
                                    <ul>
                                        {insight?.insights?.map((insight, ind) => (
                                            <li key={ind}>{insight}</li>
                                        ))}
                                    </ul>
                                </Col>
                            ))}
                        </>
                    )}

                </Row>
            </h5>
        </div>
    )
}

export default Dashboard