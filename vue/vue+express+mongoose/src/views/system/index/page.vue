<template>
	<d2-container
		class="am-flight-container"
		v-loading="loading"
	    element-loading-text="拼命加载中"
	    element-loading-background="rgba(0, 0, 0, 0.5)"
	>
	    <div class="am-flight-header">
	    	<div class="am-flight-search">
	    		<el-input
				    placeholder="搜索"
				    prefix-icon="el-icon-search"
				    v-model="searchFnum.value"
				    :clearable="true"
				    @keyup.native.enter="searchFnumFn('enter')"
				    @input="searchFnumFn('input')"
				>
			  	</el-input>
			  	<span class="num">{{searchFnum.num}}/{{searchFnum.lists.length}}</span>
	    	</div>
	    	<div class="am-flight-date zh-ml-16">
		    	<el-select
		    		class="am-select"
		    		v-model="dateSelect.value" placeholder="请选择"
		    		@change="dateChangeFn('select')"
		    	>
				    <el-option
					    v-for="item in dateSelect.opts"
					    :key="item.value"
					    :label="item.label"
					    :value="item.value"
					>
				    </el-option>
			  	</el-select>
			  	<div class="am-date-box">
			  		<el-date-picker
				  		class="am-date"
				  		:class="{'active': dateSelect.value == 0}"
					    v-model="dateSelect.date"
					    type="date"
					    :clearable="false"
					    style="width: 140px"
					    placeholder="选择日期"
					    value-format="yyyy-MM-dd"
					    @change="dateChangeFn"
					>
				    </el-date-picker>
				    <el-date-picker
				    	class="am-date"
				    	:class="{'active': dateSelect.value == 1}"
					    v-model="dateSelect.dateRange"
					    type="datetimerange"
					    :clearable="false"
					    style="width: 340px"
					    range-separator="至"
					    start-placeholder="开始日期"
					    end-placeholder="结束日期"
					    prefix-icon="el-icon-date"
					    align="right"
					    @change="dateChangeFn('dateRange')"
					    value-format="yyyy-MM-dd HH:mm:ss"
					    :default-time="['00:00:00', '23:59:59']"
					>
				    </el-date-picker>
			  	</div>
		    </div>
		    <div class="zh-fr">
		    	<span class="am-flight-export" @click="exportListFn">
		    		<i class="fa fa-share-square-o" aria-hidden="true"></i>导出列表
		    	</span>
		    </div>
	    </div>

	    <div class="am-flight-main">
	    	<vxe-table
	    		border
		        show-overflow
		        show-header-overflow
		        highlight-hover-row
		        :auto-resize="true"
		        height="auto"
		        resizable
		        highlight-hover-row
		        ref="xTable"
		        :sort-config="{iconAsc: 'el-icon-caret-top', iconDesc: 'el-icon-caret-bottom'}"
		        :row-class-name="rowClassName"
	    		@cell-dblclick="rowDblclickFn"
	        >
		        <vxe-table-column
		        	type="seq"
		        	width="60"
		        	title="序号"
		        	fixed="left"
		        />
		        <vxe-table-column
		        	width="90"
		        	title="执飞航班"
		        	field="main_flight"
		        	fixed="left"
		        >
		        	<template v-slot:header>
			        	<el-popover
			        		popper-class="am-flight-popover"
						    placement="top" trigger="click"
						    @hide="searchPopoverHideFn"
						>
						    <el-input
							    placeholder="搜索，多个以空格间隔"
							    prefix-icon="el-icon-search"
							    clearable
							    v-model="filterOpts.searchVal"
							    @change="(value) => { searchListFn({val: value, name:'main_flight'}) }"
							>
							</el-input>
						    <span
						    	class="text-underline" slot="reference"
						    	@click="searchPopoverShowFn($event)"
						    >执飞航班</span>
						</el-popover>
					</template>
					<template v-slot="{row}">
		    			{{row.main_flight}}
				    </template>
		        </vxe-table-column>
		        <vxe-table-column
		        	width="90"
		        	title="华夏航班"
		        	field="through_flight"
		        >
		        	<template v-slot:header>
			        	<el-popover
			        		popper-class="am-flight-popover"
						    placement="top" trigger="click"
						    @hide="searchPopoverHideFn"
						>
						    <el-input
							    placeholder="搜索，多个以空格间隔"
							    prefix-icon="el-icon-search"
							    clearable
							    v-model="filterOpts.searchVal"
							    @change="(value) => { searchListFn({val: value, name:'through_flight'}) }"
							>
							</el-input>
						    <span
						    	class="text-underline" slot="reference"
						    	@click="searchPopoverShowFn($event)"
						    >华夏航班</span>
						</el-popover>
					</template>
					<template v-slot="{row}">
		    			{{row.through_flight}}
				    </template>
		        </vxe-table-column>
		        <vxe-table-column
		        	width="110"
		        	title="起飞"
		        	field="dep_name"
		        	show-overflow="tooltip"
		        >
		        	<template v-slot:header>
			        	<el-popover
			        		popper-class="am-flight-popover"
						    placement="top" trigger="click"
						    @hide="searchPopoverHideFn"
						>
						    <el-input
							    placeholder="搜索，多个以空格间隔"
							    prefix-icon="el-icon-search"
							    clearable
							    v-model="filterOpts.searchVal"
							    @change="(value) => { searchListFn({val: value, name:'dep_name'}) }"
							>
							</el-input>
						    <span
						    	class="text-underline" slot="reference"
						    	@click="searchPopoverShowFn($event)"
						    >起飞</span>
						</el-popover>
					</template>
		        </vxe-table-column>
		        <vxe-table-column
		        	width="90"
		        	title="起飞-IATA"
		        	field="forg"
		        >
		        	<template v-slot:header>
			        	<el-popover
			        		popper-class="am-flight-popover"
						    placement="top" trigger="click"
						    @hide="searchPopoverHideFn"
						>
						    <el-input
							    placeholder="搜索，多个以空格间隔"
							    prefix-icon="el-icon-search"
							    clearable
							    v-model="filterOpts.searchVal"
							    @change="(value) => { searchListFn({val: value, name:'forg'}) }"
							>
							</el-input>
						    <span
						    	class="text-underline" slot="reference"
						    	@click="searchPopoverShowFn($event)"
						    >起飞-IATA</span>
						</el-popover>
					</template>
		        </vxe-table-column>
		        <vxe-table-column
		        	width="110"
		        	title="落地"
		        	field="arr_name"
		        	show-overflow="tooltip"
		        >
		        	<template v-slot:header>
			        	<el-popover
			        		popper-class="am-flight-popover"
						    placement="top" trigger="click"
						    @hide="searchPopoverHideFn"
						>
						    <el-input
							    placeholder="搜索，多个以空格间隔"
							    prefix-icon="el-icon-search"
							    clearable
							    v-model="filterOpts.searchVal"
							    @change="(value) => { searchListFn({val: value, name:'arr_name'}) }"
							>
							</el-input>
						    <span
						    	class="text-underline" slot="reference"
						    	@click="searchPopoverShowFn($event)"
						    >落地</span>
						</el-popover>
					</template>
		        </vxe-table-column>
		        <vxe-table-column
		        	width="90"
		        	title="落地-IATA"
		        	field="fdst"
		        >
		        	<template v-slot:header>
			        	<el-popover
			        		popper-class="am-flight-popover"
						    placement="top" trigger="click"
						    @hide="searchPopoverHideFn"
						>
						    <el-input
							    placeholder="搜索，多个以空格间隔"
							    prefix-icon="el-icon-search"
							    clearable
							    v-model="filterOpts.searchVal"
							    @change="(value) => { searchListFn({val: value, name:'fdst'}) }"
							>
							</el-input>
						    <span
						    	class="text-underline" slot="reference"
						    	@click="searchPopoverShowFn($event)"
						    >落地-IATA</span>
						</el-popover>
					</template>
		        </vxe-table-column>
		        <vxe-table-column
		        	width="100"
		        	title="备降"
		        	field="stopcity"
		        	show-overflow="tooltip"
		        >
		        	<template v-slot:header>
			        	<el-popover
			        		popper-class="am-flight-popover"
						    placement="top" trigger="click"
						    @hide="searchPopoverHideFn"
						>
						    <el-input
							    placeholder="搜索，多个以空格间隔"
							    prefix-icon="el-icon-search"
							    clearable
							    v-model="filterOpts.searchVal"
							    @change="(value) => { searchListFn({val: value, name:'stopcity'}) }"
							>
							</el-input>
						    <span
						    	class="text-underline" slot="reference"
						    	@click="searchPopoverShowFn($event)"
						    >备降</span>
						</el-popover>
					</template>
		        </vxe-table-column>
		        <vxe-table-column
		        	width="90"
		        	title="备降-IATA"
		        	field="stop_iata"
		        >
		        	<template v-slot:header>
			        	<el-popover
			        		popper-class="am-flight-popover"
						    placement="top" trigger="click"
						    @hide="searchPopoverHideFn"
						>
						    <el-input
							    placeholder="搜索，多个以空格间隔"
							    prefix-icon="el-icon-search"
							    clearable
							    v-model="filterOpts.searchVal"
							    @change="(value) => { searchListFn({val: value, name:'stop_iata'}) }"
							>
							</el-input>
						    <span
						    	class="text-underline" slot="reference"
						    	@click="searchPopoverShowFn($event)"
						    >备降-IATA</span>
						</el-popover>
					</template>
		        </vxe-table-column>
		        <vxe-table-column
		        	width="90"
		        	title="状态"
		        	field="flight_status"
		        >
		        	<template v-slot:header>
			        	<el-dropdown
			        		trigger="click"
			        		style="width: 85px;"
			        		@visible-change="statusChangeFn"
			        	>
					    	<span class="el-dropdown-link">
					    	  	状态<i class="el-icon-arrow-down el-icon--right"></i>
					    	</span>
					      	<el-dropdown-menu
					      		class="am-flight-dropdown" slot="dropdown"
					      	>	
					      		<el-checkbox
					      			label="全部"
					      			v-model="statusSelect.all"
					      			@change="statusCheckboxFn"
							    >全部</el-checkbox>
						      	<el-checkbox-group
						      		v-model="statusSelect.selected"
						      		@change="statusCheckboxFn"
						      	>
								    <el-checkbox
								    	v-for="(item, index) in statusSelect.opts"
										:key="`statusSelect_opts_${index}`"
								    	:label="item"
								    >{{item}}</el-checkbox>
							  	</el-checkbox-group>
							</el-dropdown-menu>
					    </el-dropdown>
				    </template>
					<template v-slot="{row}">
						<template v-if="statusKeys[row.flight_status]">
							<span :class="statusKeys[row.flight_status].color">
								{{statusKeys[row.flight_status].text}}
							</span>
							<span
								v-if="statusKeys[row.flight_status] && statusKeys[row.flight_status].tag"
								class="am-tag-rect am-bg-yellow"
							>
								{{statusKeys[row.flight_status].tag}}
							</span>
						</template>
						<template v-else>{{row.flight_status}}</template>
					</template>
		        </vxe-table-column>
		        <vxe-table-column
		        	width="90"
		        	title="机号"
		        	field="aircraft_number"
		        >
		        	<template v-slot:header>
			        	<el-popover
			        		popper-class="am-flight-popover"
						    placement="top" trigger="click"
						    @hide="searchPopoverHideFn"
						>
						    <el-input
							    placeholder="搜索，多个以空格间隔"
							    prefix-icon="el-icon-search"
							    clearable
							    v-model="filterOpts.searchVal"
							    @change="(value) => { searchListFn({val: value, name:'aircraft_number'}) }"
							>
							</el-input>
						    <span
						    	class="text-underline" slot="reference"
						    	@click="searchPopoverShowFn($event)"
						    >机号</span>
						</el-popover>
					</template>
		        </vxe-table-column>
		        <vxe-table-column width="90" title="机型" field="ftype"/>
		        <vxe-table-column
		        	width="90"
		        	title="出发机位"
		        	field="dep_stand_position"
		        >
		        	<template v-slot:header>
			        	<el-popover
			        		popper-class="am-flight-popover"
						    placement="top" trigger="click"
						    @hide="searchPopoverHideFn"
						>
						    <el-input
							    placeholder="搜索，多个以空格间隔"
							    prefix-icon="el-icon-search"
							    clearable
							    v-model="filterOpts.searchVal"
							    @change="(value) => { searchListFn({val: value, name:'dep_stand_position'}) }"
							>
							</el-input>
						    <span
						    	class="text-underline" slot="reference"
						    	@click="searchPopoverShowFn($event)"
						    >出发机位</span>
						</el-popover>
					</template>
					<template v-slot="{row}">
						<div class="am-color-blue">
							{{row.dep_stand_position}}
						</div>
					</template>
		        </vxe-table-column>
		        <vxe-table-column
		        	width="90"
		        	title="到达机位"
		        	field="arr_stand_position"
		        >
		        	<template v-slot:header>
			        	<el-popover
			        		popper-class="am-flight-popover"
						    placement="top" trigger="click"
						    @hide="searchPopoverHideFn"
						>
						    <el-input
							    placeholder="搜索，多个以空格间隔"
							    prefix-icon="el-icon-search"
							    clearable
							    v-model="filterOpts.searchVal"
							    @change="(value) => { searchListFn({val: value, name:'arr_stand_position'}) }"
							>
							</el-input>
						    <span
						    	class="text-underline" slot="reference"
						    	@click="searchPopoverShowFn($event)"
						    >到达机位</span>
						</el-popover>
					</template>
					<template v-slot="{row}">
						<div class="am-color-blue">
							{{row.arr_stand_position}}
						</div>
					</template>
		        </vxe-table-column>
		        <vxe-table-column
		        	width="90"
		        	title="登机口"
		        	field="gate"
		        >
		        	<template v-slot:header>
			        	<el-popover
			        		popper-class="am-flight-popover"
						    placement="top" trigger="click"
						    @hide="searchPopoverHideFn"
						>
						    <el-input
							    placeholder="搜索，多个以空格间隔"
							    prefix-icon="el-icon-search"
							    clearable
							    v-model="filterOpts.searchVal"
							    @change="(value) => { searchListFn({val: value, name:'gate'}) }"
							>
							</el-input>
						    <span
						    	class="text-underline" slot="reference"
						    	@click="searchPopoverShowFn($event)"
						    >登机口</span>
						</el-popover>
					</template>
		        </vxe-table-column>
		        <vxe-table-column
		        	width="90"
		        	title="行李转盘"
		        	field="baggage_reclaim_carousel"
		        >
		        	<template v-slot:header>
			        	<el-popover
			        		popper-class="am-flight-popover"
						    placement="top" trigger="click"
						    @hide="searchPopoverHideFn"
						>
						    <el-input
							    placeholder="搜索，多个以空格间隔"
							    prefix-icon="el-icon-search"
							    clearable
							    v-model="filterOpts.searchVal"
							    @change="(value) => { searchListFn({val: value, name:'baggage_reclaim_carousel'}) }"
							>
							</el-input>
						    <span
						    	class="text-underline" slot="reference"
						    	@click="searchPopoverShowFn($event)"
						    >行李转盘</span>
						</el-popover>
					</template>
		        </vxe-table-column>
		       	<vxe-table-column
		       		width="85"
		       		title="计飞"
		        	field="scheduled_deptime"
		        	:formatter="formatCellFn"
		       	>
		       		<template v-slot:header>
					    计飞
					    <span class="sort-icon asc" @click.stop="sortFn({e: $event, name: 'scheduled_deptime'})">
					    	<i class="el-icon-caret-top"></i>
					    	<i class="el-icon-caret-bottom"></i>
					    </span>
					</template>
		        	<template v-slot="{row}">
						{{timeFormat(row.scheduled_deptime, 'HHmm', 1000)}}
						<template>{{getTimeDate(row.scheduled_deptime)}}</template>
					</template>
		        </vxe-table-column>
		        <vxe-table-column
		        	width="85"
		        	title="预飞"
		        	field="estimated_deptime"
		        	:formatter="formatCellFn"
		        >
		        	<template v-slot:header>
					    预飞
					    <span class="sort-icon" @click.stop="sortFn({e: $event, name: 'estimated_deptime'})">
					    	<i class="el-icon-caret-top"></i>
					    	<i class="el-icon-caret-bottom"></i>
					    </span>
					</template>
					<template v-slot="{row}">
						<div class="am-color-blue">
							{{timeFormat(row.estimated_deptime, 'HHmm', 1000)}}
							{{getTimeDate(row.estimated_deptime)}}
						</div>
					</template>
		        </vxe-table-column>
		        <vxe-table-column
		        	width="85"
		        	title="实飞"
		        	field="actual_deptime"
		        	:formatter="formatCellFn"
		        >
		        	<template v-slot:header>
					    实飞
					    <span class="sort-icon" @click.stop="sortFn({e: $event, name: 'actual_deptime'})">
					    	<i class="el-icon-caret-top"></i>
					    	<i class="el-icon-caret-bottom"></i>
					    </span>
					</template>
					<template v-slot="{row}">
						<div class="am-color-red">
							{{timeFormat(row.actual_deptime, 'HHmm', 1000)}}
							{{getTimeDate(row.actual_deptime)}}
						</div>
					</template>
		        </vxe-table-column>
		        <vxe-table-column
		        	width="85"
		        	title="计达"
		        	field="scheduled_arrtime"
		        	:formatter="formatCellFn"
		        >
		        	<template v-slot:header>
					    计达
					    <span class="sort-icon" @click.stop="sortFn({e: $event, name: 'scheduled_arrtime'})">
					    	<i class="el-icon-caret-top"></i>
					    	<i class="el-icon-caret-bottom"></i>
					    </span>
					</template>
					<template v-slot="{row}">
						{{timeFormat(row.scheduled_arrtime, 'HHmm', 1000)}}
						{{getTimeDate(row.scheduled_arrtime)}}
					</template>
		        </vxe-table-column>
		        <vxe-table-column
		        	width="85"
		        	title="预达"
		        	field="estimated_arrtime"
		        	:formatter="formatCellFn"
		        >
		        	<template v-slot:header>
					    预达
					    <span class="sort-icon" @click.stop="sortFn({e: $event, name: 'estimated_arrtime'})">
					    	<i class="el-icon-caret-top"></i>
					    	<i class="el-icon-caret-bottom"></i>
					    </span>
					</template>
					<template v-slot="{row}">
						<div class="am-color-blue">
							{{timeFormat(row.estimated_arrtime, 'HHmm', 1000)}}
							{{getTimeDate(row.estimated_arrtime)}}
						</div>
					</template>
		        </vxe-table-column>
		        <vxe-table-column
		        	width="85"
		        	title="实达"
		        	field="actual_arrtime"
		        	:formatter="formatCellFn"
		        >
		        	<template v-slot:header>
					    实达
					    <span class="sort-icon" @click.stop="sortFn({e: $event, name: 'actual_arrtime'})">
					    	<i class="el-icon-caret-top"></i>
					    	<i class="el-icon-caret-bottom"></i>
					    </span>
					</template>
					<template v-slot="{row}">
						<div class="am-color-red">
							{{timeFormat(row.actual_arrtime, 'HHmm', 1000)}}
							{{getTimeDate(row.actual_arrtime)}}
						</div>
					</template>
		        </vxe-table-column>
	      	</vxe-table>
	    </div>
	    <!-- 前后序弹层 -->
	  	<el-dialog
			title="航班序列"
			:visible.sync="orderFlight.layer"
			width="1246px"
		>
			<el-table
		    	:data="orderFlight.data"
		    	style="width: 100%"
		    	max-height="500"
		    	class="am-flight-table"
		    >
		    	<el-table-column
			    	prop="type"
			    	label="类型"
			    	width="60">
			    	<template slot-scope="scope">
		    			{{areaTypes[scope.row.fcategory]}}
		    		</template>
		    	</el-table-column>
		    	<el-table-column
		    		prop="main_flight"
		    		label="执飞航班"
		    		width="85">
		    		<template slot-scope="scope">
		    			{{scope.row.main_flight}}
				    </template>
		    	</el-table-column>
		    	<el-table-column
		    		:show-overflow-tooltip="true"
		    		prop="fnum"
		    		label="华夏航班"
		    		width="145">
		    		<template slot-scope="scope">
		    			{{scope.row.through_flight}}
				    </template>
		    	</el-table-column>
		    	<el-table-column
		    		:show-overflow-tooltip="true"
		    		label="航线"
		    		width="160"
		    	>
		    		<template slot-scope="scope">
		    			{{scope.row.dep_name}}-{{scope.row.arr_name}}
		    		</template>
		    	</el-table-column>
		    	<el-table-column
		    		prop="dep_stand_position"
		    		label="出发机位"
		    		width="80">
		    	</el-table-column>
		    	<el-table-column
		    		prop="arr_stand_position"
		    		label="到达机位"
		    		width="80">
		    	</el-table-column>
		    	<el-table-column
		    		prop="scheduled_deptime"
		    		label="计飞"
		    		width="85">
		    		<template slot-scope="scope">
		    			{{timeFormat(scope.row.scheduled_deptime, 'HHmm', 1000)}}
						{{getTimeDate(scope.row.scheduled_deptime)}}
		    		</template>
		    	</el-table-column>
		    	<el-table-column
		    		prop="estimated_deptime"
		    		label="预飞"
		    		width="85">
		    		<template slot-scope="scope">
		    			{{timeFormat(scope.row.estimated_deptime, 'HHmm', 1000)}}
						{{getTimeDate(scope.row.estimated_deptime)}}
		    		</template>
		    	</el-table-column>
		    	<el-table-column
		    		prop="actual_deptime"
		    		label="实飞"
		    		width="85">
		    		<template slot-scope="scope">
		    			{{timeFormat(scope.row.actual_deptime, 'HHmm', 1000)}}
						{{getTimeDate(scope.row.actual_deptime)}}
		    		</template>
		    	</el-table-column>
		    	<el-table-column
		    		prop="scheduled_arrtime"
		    		label="计达"
		    		width="85">
		    		<template slot-scope="scope">
		    			{{timeFormat(scope.row.scheduled_arrtime, 'HHmm', 1000)}}
						{{getTimeDate(scope.row.scheduled_arrtime)}}
		    		</template>
		    	</el-table-column>
		    	<el-table-column
		    		prop="estimated_arrtime"
		    		label="预达"
		    		width="85">
		    		<template slot-scope="scope">
		    			{{timeFormat(scope.row.estimated_arrtime, 'HHmm', 1000)}}
						{{getTimeDate(scope.row.estimated_arrtime)}}
		    		</template>
		    	</el-table-column>
		    	<el-table-column
		    		prop="actual_arrtime"
		    		label="实达"
		    		width="85">
		    		<template slot-scope="scope">
		    			{{timeFormat(scope.row.actual_arrtime, 'HHmm', 1000)}}
						{{getTimeDate(scope.row.actual_arrtime)}}
		    		</template>
		    	</el-table-column>
		    	<el-table-column
		    		prop="flight_status"
		    		label="状态"
		    		width="90">
			      	<template slot-scope="scope">
						<template v-if="statusKeys[scope.row.flight_status]">
							<span :class="statusKeys[scope.row.flight_status].color">
								{{statusKeys[scope.row.flight_status].text}}
							</span>
							<span
								v-if="statusKeys[scope.row.flight_status] && statusKeys[scope.row.flight_status].tag"
								class="am-tag-rect am-bg-yellow"
							>
								{{statusKeys[scope.row.flight_status].tag}}
							</span>
						</template>
						<template v-else>{{scope.row.flight_status}}</template>
					</template>
		    	</el-table-column>
		    </el-table>
		</el-dialog>
  	</d2-container>
</template>

<script>
import render from './js/render';
export default render;
</script>

<style lang="scss">
// css调用
@import "./scss";
</style>
