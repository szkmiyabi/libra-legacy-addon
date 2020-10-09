/* ############################################################ *
 *
 * 一括検査ユーティリティクラス
 * 
 * ############################################################ */
class libraAllSvUtil {
	/*-----------------------------------------
		コンストラクタ
	-------------------------------------------*/
    constructor() {
        this.heading = document.getElementsByTagName("table").item(0);
		this.tbl = document.getElementsByTagName("table").item(2);
		this.flags = {
			"UNCOMP": "CHECK",
			"PASS": "PASS_HC",
			"PASS2": "PASS2",
			"FAIL": "FAIL_HC",
			"NA": "NA_HC"
		};
		this.nmflags = {
			"CHECK": "0",
			"PASS_HC": "1",
			"PASS2": "2",
			"FAIL_HC": "3",
			"NA_HC": "4"
		};
		this.cpflags = {
			"yes": "1",
			"no" : "0"
        };
        this.mdflags = {
            "table" : "0",
            "checked" : "1",
            "uncomplete": "2"
        };
    }
	/*-----------------------------------------
		commonメソッド
	-------------------------------------------*/
    init_datas() {
        return this.tbl.rows;
    }

    survey_obj(row_obj) {
        return row_obj.cells.item(2);
    }

    comment_obj(row_obj) {
        return row_obj.cells.item(3);
    }

    description_obj(row_obj) {
        return row_obj.cells.item(4);
    }

    srccode_obj(row_obj) {
        return row_obj.cells.item(5);
    }

    get_text(obj) {
        return obj.getElementsByTagName("textarea").item(0).value;
    }

    set_text(obj, str) {
        obj.getElementsByTagName("textarea").item(0).value = str;
    }

    clear_text(obj) {
        obj.getElementsByTagName("textarea").item(0).value = "";
    }

    set_survey(obj, flag) {
        var ts = obj.getElementsByTagName("select").item(0);
        var key_val = "";
        for(var key in this.flags) {
            if(key == flag) {
                key_val = this.flags[key];
                break;
            }
        }
        var key_nm = 0;
        for(var key in this.nmflags) {
            if(key == key_val) {
                key_nm = Number(this.nmflags[key]);
                break;
            }
        }
        for(var i=0; i<ts.length; i++) {
            if(ts.options[i].value == key_val) {
                ts.selectedIndex = key_nm;
                var event = document.createEvent("HTMLEvents");
                event.initEvent("change", true, false);
                ts.dispatchEvent(event);
                break;
            }
        }
    }

    get_survey(obj) {
        var ts = obj.getElementsByTagName("select").item(0);
        var idx = ts.selectedIndex + "";
        var primary_key = "";
        var secondary_key = "";
        for(var key in this.nmflags) {
            var val = this.nmflags[key] + "";
            if(idx === val) {
                primary_key = key;
                break;
            }
        }
        for(var key in this.flags) {
            var val = this.flags[key];
            if(primary_key === val) {
                secondary_key = key;
                break;
            }
        }
        return secondary_key;

    }

    set_survey_cp(obj, flag) {
        var key = this.cpflags[flag];
        var inps = obj.getElementsByTagName("input");
        for(var i=0; i<inps.length; i++) {
            var inp = inps.item(i);
            if(inp.value === key) {
                inp.click();
            }
        }
    }

    get_survey_cp(obj) {
        var ret = "";
        var inps = obj.getElementsByTagName("input");
        for(var i=0; i<inps.length; i++) {
            var inp = inps.item(i);
            if(inp.checked === true) {
                var key_vl = inp.value;
                for(var k in this.cpflags) {
                    if(key_vl === this.cpflags[k]) {
                        return k;
                    }
                }
            }
        }
    }

    is_text_empty(obj) {
        var ta = obj.getElementsByTagName("textarea").item(0);
        if(ta.value === "" || ta.value === null) return true;
        else return false;
    }

    save() {
        var d = document.getElementsByTagName("input");
        for(var i=0; i < d.length; i++) {
            var itag = d.item(i);
            var ival = itag.value;
            if(ival == "一括登録") {
                itag.click();
            break;
            }
        }
    }

    clean_text(str) {
        str = str.replace(/^ +/mg, "");
        str = str.replace(/(\r\n|\n)/mg, "");
        str = str.replace(/\t/mg, "");
        return str;
    }
    
    get_tech_code() {
        var rows = this.heading.rows;
        var row = rows.item(0);
        return row.cells.item(5).innerText;
    }

    page_state_check() {
        var tmp = null;
        var regx = new RegExp("allupd/$");
        var tmp = regx.test(location.href);
        if(tmp == false) {
            return "first";
        } else if(tmp == true) {
            return "last";
        }
    }

    mode_select(key_str) {
        var ips = document.getElementsByTagName("input");
        var key_val = "";
        for(var key in this.mdflags) {
          if(key == key_str) {
            key_val = this.mdflags[key].toString();
            break;
          }
        }
        for(var i=0; i < ips.length; i++) {
            var itag = ips.item(i);
            var iname = itag.getAttribute("name");
            var ival = itag.getAttribute("value");
            if(iname == "target" && ival == key_val) itag.click();
        }
    }

    click_save_btn() {
        var d = document.getElementsByTagName("input");
        for(var i=0; i < d.length; i++) {
            var itag = d.item(i);
            var ival = itag.value;
            if(ival == "一括登録") {
                itag.click();
                break;
            }
        }
    }

    click_close_btn() {
        var d = document.getElementsByTagName("input");
        for(var i=0; i < d.length; i++) {
            var itag = d.item(i);
            var ival = itag.value;
            if(ival == "閉じる") {
                itag.click();
                break;
            }
        }
    }
	/*-----------------------------------------
		一括検査メソッド一式
	-------------------------------------------*/
    all_sv(key_str) {
        this.mode_select("uncomplete");
        if(this.page_state_check() == "last") {
            this.click_close_btn();
            return;
        }
        var s = document.getElementsByTagName("select");
        var _flags = {
            "PASS" : "PASS_HC",
            "PASS2" : "PASS2",
            "NA" : "NA_HC"
        };
        var key_val = "";
        for(var key in _flags) {
            if(key == key_str) {
                key_val = _flags[key].toString();
                break;
            }
        }
        var _nmflags = {
            "PASS_HC" : "0",
            "PASS2" : "1",
            "NA_HC" : "2"
        };
        var key_nm = 0;
        for(var key in _nmflags) {
            if(key == key_val) {
                key_nm = Number(_nmflags[key].toString());
                break;
            }
        }
        var ts = null;
        for(var i=0; i < s.length; i++) {
            var itag = s.item(i);
            var iname = itag.getAttribute("name");
            if(iname == "result") ts = itag;
        }
        for(var i=0; i < ts.length; i++) {
            if(ts.options[i].value == key_val) {
                ts.selectedIndex = key_nm;
                var event = document.createEvent("HTMLEvents");
                event.initEvent("change", true, false);
                ts.dispatchEvent(event);
                break;
            }
        }
        this.click_save_btn();
    }

    all_OK() {

        this.all_sv("PASS");
    }

    all_NA() {
        this.all_sv("NA");
    }

    table_OK() {
        var arr = this.init_datas();
        for(var i=0; i<arr.length; i++) {
            if(i == 0) continue;
            var row = arr.item(i);
            var survey_obj = this.survey_obj(row);
            var comment_obj = this.comment_obj(row);
            var description_obj = this.description_obj(row);
            var srccode_obj = this.srccode_obj(row);
            this.set_survey(survey_obj, "PASS");
            this.set_text(comment_obj, "");
            this.set_text(srccode_obj, "");
        }
    }

    table_NA() {
        var arr = this.init_datas();
        for(var i=0; i<arr.length; i++) {
            if(i == 0) continue;
            var row = arr.item(i);
            var survey_obj = this.survey_obj(row);
            var comment_obj = this.comment_obj(row);
            var description_obj = this.description_obj(row);
            var srccode_obj = this.srccode_obj(row);
            this.set_survey(survey_obj, "NA");
            this.set_text(comment_obj, "判定すべき対象コンテンツが使用されていない");
        }
    }
}

//一括検査ユーティリティクラスのインスタンス
const allSvUtil = new libraAllSvUtil();

browser.runtime.onMessage.addListener((message) => {

    let cmd = message.command;
    switch(cmd) {
        case "all-ok":
            allSvUtil.all_OK();
            break;
        case "all-na":
            allSvUtil.all_NA();
            break;
        case "table-ok":
            allSvUtil.table_OK();
            break;
        case "table-na":
            allSvUtil.table_NA();
            break;
        default:
            break;
    }
    
});
