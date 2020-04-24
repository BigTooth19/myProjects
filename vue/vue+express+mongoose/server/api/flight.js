const {app, mongoose} = require('../db');
const flightDatas = require('./flightDatas');
const Flight = mongoose.model('flight', new mongoose.Schema({
    id: String,
    outgatetime: String,
	ingatetime: String,
	flight_status_code: String,
	departure_terminal: String,
	arrival_terminal: String,
	aircraft_number: String,
	ports_of_call: String,
	ftype: String,
	board_status_code: String,
	forg: String,
	fdst: String,
	main_flight: String,
	flight_date: String,
	scheduled_deptime: String,
	scheduled_arrtime: String,
	estimated_deptime: String,
	estimated_arrtime: String,
	actual_deptime: String,
	actual_arrtime: String,
	dep_stand_position: String,
	arr_stand_position: String,
	gate: String,
	force_landing_flag: String,
	baggage_reclaim_carousel: String,
	share_execute_flag: String,
	share_flight: String,
	fnum: String,
	estimated_outtime: String,
	estimated_intime: String,
	fservice: String,
	fcategory: String,
	stopcity: String,
	through_flight: String,
	flight_status: String,
	dep_name: String,
	dep_city: String,
	arr_name: String,
	arr_city: String,
	stop_iata: String
}), 'flights');

// 添充数据
// Flight.create(flightDatas);
// 航班列表接口
app.get('/main/lists/', async(req, res) => {
    let result = await Flight.find();
    res.send({
        code: 0,
        data: {
            data: {
                del: [],
                update: [],
                add: [],
                init: result
            },
            param: {
                token: "af02c225-bee6-5bda-ae41-2541b3b9376c",
                model_time: "0",
                start_datetime: 1587657600,
                end_datetime: 1587743999
            }
        },
        msg: "success"
    });
});
// 前后序航班
app.post('/main/aircraft/', (req, res) => {
    let params = {aircraft_number: req.body.aircraft_number};
    Flight.find(params, (err, data) => {
        if(!err) {
            res.send({
                code: 0,
                data,
                msg: "success"
            });
        }    
    });
    
});
module.exports = app;