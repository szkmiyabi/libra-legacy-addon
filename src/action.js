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

    table_NG2NA() {
        var arr = this.init_datas();
        for(var i=0; i<arr.length; i++) {
            if(i == 0) continue;
            var row = arr.item(i);
            var survey_obj = this.survey_obj(row);
            var comment_obj = this.comment_obj(row);
            var description_obj = this.description_obj(row);
            var srccode_obj = this.srccode_obj(row);
            var cr_sv = this.get_survey(survey_obj);
            if(cr_sv == "FAIL") {
                this.set_survey(survey_obj, "NA");
                this.set_text(comment_obj, "判定すべき対象コンテンツが使用されていない");
            }
        }
    }
    
    table_NG2TK() {
        var arr = this.init_datas();
        for(var i=0; i<arr.length; i++) {
            if(i == 0) continue;
            var row = arr.item(i);
            var survey_obj = this.survey_obj(row);
            var comment_obj = this.comment_obj(row);
            var description_obj = this.description_obj(row);
            var srccode_obj = this.srccode_obj(row);
            var cr_sv = this.get_survey(survey_obj);
            if(cr_sv == "FAIL") {
                this.set_survey(survey_obj, "PASS2");
                if(this.get_text(comment_obj) == "") this.set_text(comment_obj, "*");
                if(this.get_text(description_obj) == "") this.set_text(description_obj, "*");
                this.set_text(srccode_obj, "");
            }
        }
    }

}

//一括検査ユーティリティクラスのインスタンス
const allSvUtil = new libraAllSvUtil();

//JSインスタント実行関数
const instantJS = function() {
    var src = prompt("実行したいJavascriptコードを入力または貼り付けてください");
    eval("{" + src + "}");
};

//単一検査画面機能拡張ユーティリティ関数
const llb_sv_ui_tool = function() {
	var add_btn = document.getElementById("addcomment");
	var description_ta = document.querySelector(`#description`);
	var srccode_ta = document.querySelector(`#srccode`);

	var btn = document.createElement("a");
	btn.innerHTML = `<span class="diag_sample_btn" style="float: left;margin-left:10px;cursor:pointer;font-size:75%;background-color:#006DA4"">再検OK</span>`;
	btn.setAttribute("id", `svupd_ok_btn`);
	btn.setAttribute("href", `javascript:void(0)`);
	var btn_scr1 = `
		(function(){
			var src = document.querySelector('#comments');
			var today = new Date();
			var m = today.getMonth()+1;
			var d = today.getDate();
			var addtxt = m + '/' + d + ' 修正を確認\\r\\n' + '---' + '\\r\\n\\r\\n';
			var sentence = src.value;
			sentence = addtxt + sentence;
			src.value = sentence;
			var rds = document.getElementsByName("result");
			rds[0].click();
		})();
	`;
	btn.setAttribute("onclick", btn_scr1);
	add_btn.parentElement.insertBefore(btn, add_btn.nextSibling);

	var btn1 = document.querySelector("#svupd_ok_btn");
	var btn = document.createElement("a");
	btn.innerHTML = `<span class="diag_sample_btn" style="float: left;margin-left:10px;cursor:pointer;font-size:75%;background-color:#006DA4;margin-left:3px">再検注記</span>`;
	btn.setAttribute("id", `svupd_tk_btn`);
	btn.setAttribute("href", `javascript:void(0)`);
	var btn_scr2 = `
		(function(){
			var src = document.querySelector('#comments');
			var today = new Date();
			var m = today.getMonth()+1;
			var d = today.getDate();
			var addtxt = m + '/' + d + ' 適合(注記)に差替\\r\\n' + '---' + '\\r\\n\\r\\n';
			var sentence = src.value;
			sentence = addtxt + sentence;
			src.value = sentence;
			var rds = document.getElementsByName("result");
			rds[1].click();
		})();
	`;
	btn.setAttribute("onclick", btn_scr2);
	btn1.parentElement.insertBefore(btn, btn1.nextSibling);

	var btn2 = document.querySelector("#svupd_tk_btn");
	var btn = document.createElement("a");
	btn.innerHTML = `<span class="diag_sample_btn" style="float: left;margin-left:10px;cursor:pointer;font-size:75%;background-color:#006DA4;margin-left:3px">クリア</span>`;
	btn.setAttribute("id", `comment_clear_btn`);
	btn.setAttribute("href", `javascript:void(0)`);
	var btn_scr3 = `
		(function(){
			document.querySelector('#comments').value = "";
		})();
	`;
	btn.setAttribute("onclick", btn_scr3);
	btn2.parentElement.insertBefore(btn, btn2.nextSibling);

	var btn3 = document.querySelector("#comment_clear_btn");
	var btn = document.createElement("a");
	btn.innerHTML = `<span class="diag_sample_btn" style="float: left;margin-left:10px;cursor:pointer;font-size:75%;background-color:#006DA4;margin-left:3px">改行</span>`;
	btn.setAttribute("id", `comment_br_btn`);
	btn.setAttribute("href", `javascript:void(0)`);
	var btn_scr4 = `
		(function(){
			var src = document.querySelector('#comments');
			var sentence = src.value;
			var len = sentence.length;
			var pos = src.selectionStart;
			var before = sentence.substr(0, pos);
			var after = sentence.substr(pos, len);
			sentence = before + "\\r\\n" + after;
			src.value = sentence;
		})();
	`;
	btn.setAttribute("onclick", btn_scr4);
	btn3.parentElement.insertBefore(btn, btn3.nextSibling);

	var btn = document.createElement("a");
	btn.innerHTML = `<span class="diag_sample_btn" style="float: left;margin-left:10px;margin-top:5px;cursor:pointer;font-size:75%;background-color:#006DA4;margin-left:3px">クリア</span>`;
	btn.setAttribute("id", `description_clear_btn`);
	btn.setAttribute("href", `javascript:void(0)`);
	var btn_scr1 = `
		(function(){
			document.querySelector('#description').value = "";
		})();
	`;
	btn.setAttribute("onclick", btn_scr1);
	description_ta.parentElement.insertBefore(btn, description_ta);

	var btn1 = document.querySelector(`#description_clear_btn`);
	var btn = document.createElement("a");
	btn.innerHTML = `<span class="diag_sample_btn" style="float: left;margin-left:10px;margin-top:5px;cursor:pointer;font-size:75%;background-color:#006DA4;margin-left:3px">改行</span>`;
	btn.setAttribute("id", `description_br_btn`);
	btn.setAttribute("href", `javascript:void(0)`);
	var btn_scr2 = `
		(function(){
			var src = document.querySelector('#description');
			var sentence = src.value;
			var len = sentence.length;
			var pos = src.selectionStart;
			var before = sentence.substr(0, pos);
			var after = sentence.substr(pos, len);
			sentence = before + "\\r\\n" + after;
			src.value = sentence;
		})();
	`;
	btn.setAttribute("onclick", btn_scr2);
	btn1.parentElement.insertBefore(btn, btn1.nextSibling);

	var btn = document.createElement("a");
	btn.innerHTML = `<span class="diag_sample_btn" style="float: left;margin-left:10px;margin-top:5px;cursor:pointer;font-size:75%;background-color:#006DA4;margin-left:3px">クリア</span>`;
	btn.setAttribute("id", `srccode_clear_btn`);
	btn.setAttribute("href", `javascript:void(0)`);
	var btn_scr1 = `
		(function(){
			document.querySelector('#srccode').value = "";
		})();
	`;
	btn.setAttribute("onclick", btn_scr1);
	srccode_ta.parentElement.insertBefore(btn, srccode_ta);

	var btn1 = document.querySelector(`#srccode_clear_btn`);
	var btn = document.createElement("a");
	btn.innerHTML = `<span class="diag_sample_btn" style="float: left;margin-left:10px;margin-top:5px;cursor:pointer;font-size:75%;background-color:#006DA4;margin-left:3px">改行</span>`;
	btn.setAttribute("id", `srccode_br_btn`);
	btn.setAttribute("href", `javascript:void(0)`);
	var btn_scr2 = `
		(function(){
			var src = document.querySelector('#srccode');
			var sentence = src.value;
			var len = sentence.length;
			var pos = src.selectionStart;
			var before = sentence.substr(0, pos);
			var after = sentence.substr(pos, len);
			sentence = before + "\\r\\n" + after;
			src.value = sentence;
		})();
	`;
	btn.setAttribute("onclick", btn_scr2);
	btn1.parentElement.insertBefore(btn, btn1.nextSibling);
};

//検査結果確認用画面ユーティリティ
const llb_repo_util = function() {
    var cr_url = location.href;
    function open_repo(){
        function reportUtil() {
            url = window.location.href;
            base_origin = "https://jis.infocreate.co.jp/diagnose/indexv2/report/projID/";
        }
        reportUtil.prototype = {
            is_text_select: function() {
                if(window.getSelection().toString() !== "") return true;
                else return false;
            },
            is_valid_select: function(str) {
                var pat = new RegExp(/^[0-9]+/);
                var tt = this.get_select_text();
                if(pat.test(tt)) return true;
                else return false;
            },
            get_select_text: function() {
                return window.getSelection().toString();
            },
            is_survey_page: function() {
                var pat1 = new RegExp(/\/diagnose\/indexv2\/index\/projID\/\"*[0-9]+\"*/);
                var pat2 = new RegExp(/\/diagnose\/indexv2\/index\/reset\/(true|false)\/projID\/\"*[0-9]+\"*/);
                if(pat1.test(url) || pat2.test(url)) return true;
                else return false;
            },
            is_main_page: function() {
                var pat = new RegExp(/\/diagnose\/indexv2\/report\/projID\/[0-9]+/);
                if(pat.test(url)) return true;
                else return false;
            },
            is_detail_page: function() {
                var pat = new RegExp(/\/diagnose\/indexv2\/report2\/projID\/[0-9]+\/controlID\//);
                if(pat.test(url)) return true;
                else return false;
            },
            is_top_page: function() {
                var pat = new RegExp(/https:\/\/jis\.infocreate\.co\.jp[^.]/);
                if(pat.test(url)) return true;
                else return false;
            },
            browse_report_from_survey_page: function() {
                var pat = new RegExp(/projID\/([0-9]+)/);
                if(pat.test(url)) {
                    var mt = url.match(pat);
                    var new_url = base_origin + mt[1].toString();
                    window.open(new_url, "_blank");
                } else {
                    return;
                }
            },
            browse_report_from_selection: function() {
                if(!this.is_text_select()) {
                    alert('プロジェクトIDが選択されていません！');
                    return;
                }
                if(!this.is_valid_select()) {
                    alert('範囲選択が正しくありません！');
                    return;
                }
                var new_url = base_origin + this.get_select_text().trim();
                window.open(new_url, "_blank");
            },
            browse_report_from_prompt: function() {
                var src = prompt("プロジェクト番号を入力してください").trim();
                if(!new RegExp(/^[0-9]+/).test(src)) {
                    alert('プロジェクト番号が正しくありません！');
                    return;
                }
                var new_url = base_origin + src;
                window.open(new_url, "_blank");
            }
        };
    
        var util = new reportUtil();
        if(util.is_top_page())util.browse_report_from_selection();
        else if(util.is_survey_page()) util.browse_report_from_survey_page();
        else util.browse_report_from_prompt();
    }
    function act_repo() {
        function resultTblUtil() {
            this.htbl = document.getElementsByTagName("table").item(1);
            this.tbl = document.getElementsByTagName("table").item(2);
            this.lbui_url = "http://jis.infocreate.co.jp/diagnose/indexv2/index/projID/";
            this.url = window.location.href;
            this.rep_detail_pt = new RegExp(/\/diagnose\/indexv2\/report2\/projID\/[0-9]+\/controlID\/[a-zA-Z0-9]+\/guideline\/[0-9\.]+/);
        }
        resultTblUtil.prototype = {
            get_proj_code: function() {
                var obj = this.htbl.rows.item(0).cells.item(1);
                var tt = obj.innerHTML;
                var pt = new RegExp(/(\[)([0-9]+)(\])(.+)/);
                if(pt.test(tt)) {
                    return tt.match(pt)[2];
                }
            },
            get_ui_link: function(page_num) {
                var pjc = this.get_proj_code();
                return this.lbui_url + pjc + '/controlID/"' + page_num + '"';
            },
            build_arr: function() {
                var arr = new Array();
                var trs = this.tbl.rows;
                for(var i=0; i<trs.length; i++) {
                    if(i < 2) continue;
                    var tr = trs.item(i);
                    var in_arr = new Array();
                    for(var j=0; j<tr.cells.length; j++) {
                        var td = tr.cells.item(j);
                        in_arr[j] = td.innerHTML;
                    }
                    arr.push(in_arr);
                }
                return arr;
            },
            add_target_b: function() {
                var trs = this.tbl.rows;
                for(var i=0; i<trs.length; i++) {
                    if(i < 2) continue;
                    var tr = trs.item(i);
                    for(var j=0; j<tr.cells.length; j++) {
                        if(j < 2) continue;
                        var td = tr.cells.item(j);
                        var atg = td.getElementsByTagName("a").item(0);
                        atg.setAttribute("target", "_blank");
                    }
                }
            },
            add_ui_link: function() {
                var trs = this.tbl.rows;
                for(var i=0; i<trs.length; i++) {
                    if(i < 2) continue;
                    var tr = trs.item(i);
                    var cl = tr.cells.item(0);
                    var ctx = cl.innerHTML.trim();
                    ctx = '<a href=\'' + this.get_ui_link(ctx) + '\' target="_blank">' + ctx + "</a>";
                    cl.innerHTML = ctx;
                }
            },
            add_js: function() {
                var scr = document.createElement("script");
                var scrtxt = "";
                scrtxt += 'function add_mark(num) {';
                scrtxt += 'var trs = document.getElementsByTagName("table").item(2).rows;';
                scrtxt += 'for(var i=0; i<trs.length; i++) {';
                scrtxt += 'if(i < 2) continue;';
                scrtxt += 'var tr = trs.item(i);';
                scrtxt += 'for(var j=0; j<tr.cells.length; j++) {';
                scrtxt += 'if(j < 2) continue;';
                scrtxt += 'var cls = tr.cells.item(j);';
                scrtxt += 'if(j == num) {';
                scrtxt += 'if(cls.getAttribute("style") === null) {';
                scrtxt += 'cls.setAttribute("style", "background:yellow");';
                scrtxt += 'cls.getElementsByTagName("a").item(0).setAttribute("onclick", "change_color()");';
                scrtxt += '} else {';
                scrtxt += 'cls.removeAttribute("style");';
                scrtxt += 'cls.getElementsByTagName("a").item(0).removeAttribute("onclick");';
                scrtxt += '}';
                scrtxt += 'break;';
                scrtxt += '}';
                scrtxt += '}';
                scrtxt += '}';
                scrtxt += '}';
                scrtxt += 'function change_color() {';
                scrtxt += 'var e = (window.event) ? window.event : arguments.callee.caller.arguments[0];';
                scrtxt += 'var me = e.target || e.srcElement;';
                scrtxt += 'me.parentNode.setAttribute("style", "background: #ff4fa7");';
                scrtxt += '}';
                scrtxt += 'function change_line_color() {';
                scrtxt += 'var e = (window.event) ? window.event : arguments.callee.caller.arguments[0];';
                scrtxt += 'var me = e.target || e.srcElement;';
                scrtxt += 'var tr = me.parentNode.parentNode;';
                scrtxt += 'var tds = tr.getElementsByTagName("td");';
                scrtxt += 'for(var i=0; i<tds.length; i++) {';
                scrtxt += 'var cell = tds.item(i);';
                scrtxt += 'if(cell.getAttribute("style") === "white-space:nowrap") cell.removeAttribute("style");';
                scrtxt += 'if(cell.getAttribute("style") === null){';
                scrtxt += 'var csstxt = "";';
                scrtxt += 'if(i==0) csstxt = "background: #ff4fa7;white-space:nowrap;";';
                scrtxt += 'else csstxt = "background: #ff4fa7;";';
                scrtxt += 'cell.setAttribute("style", csstxt);';
                scrtxt += '} else if(cell.getAttribute("style") === "background:yellow") {';
                scrtxt += '} else {';
                scrtxt += 'cell.removeAttribute("style");';
                scrtxt += '}';
                scrtxt += '}';
                scrtxt += '}';
                scr.textContent = scrtxt;
                document.getElementsByTagName("body").item(0).appendChild(scr);
            },
            add_handle: function() {
                var trs = this.tbl.rows;
                var tr = trs.item(1);
                for(var j=0; j<tr.cells.length; j++) {
                    var cls = tr.cells.item(j);
                    var clstxt = cls.innerHTML;
                    clstxt = '<a href="javascript:void(0)" onclick="add_mark(' + (j + 2) + ');return false;" style="text-decoration:none">' + clstxt + "</a>";
                    cls.innerHTML = clstxt;
                }
            },
            add_line_handle: function() {
                var trs = this.tbl.rows;
                for(var i=0; i<trs.length; i++) {
                    if(i < 2) continue;
                    var tr = trs.item(i);
                    var td = tr.cells.item(0);
                    td.setAttribute("style", "white-space:nowrap");
                    var inhtml = td.innerHTML;
                    var new_inhtml = '<input type="checkbox" onclick="change_line_color()">' + inhtml;
                    td.innerHTML = new_inhtml;
                }
            },
            is_detail_pg: function() {
                if(this.rep_detail_pt.test(this.url)) return true;
                else return false;
            },
            get_page_num_detail_pg: function() {
                var obj = this.htbl.rows.item(1).cells.item(1);
                var tt = obj.innerHTML;
                var pt = new RegExp(/(\[)([a-zA-Z0-9]+)(\])(.+)/);
                if(pt.test(tt)) {
                    return tt.match(pt)[2];
                }
            },
            browse_ui: function() {
                window.open(this.get_ui_link(this.get_page_num_detail_pg()), "_blank");
            },
        };
    
        function indexUtil(ui) { this.ui = ui; }
        indexUtil.prototype = {
            exec: function() {
                this.ui.add_target_b();
                this.ui.add_ui_link();
                this.ui.add_js();
                this.ui.add_handle();
                this.ui.add_line_handle();
            }
        };
        function detailUtil(ui) { this.ui = ui; }
        detailUtil.prototype = {
            exec: function() {
                this.ui.browse_ui();
            }
        };
    
    
        var ui = new resultTblUtil();
        var exe = null;
    
        if(ui.is_detail_pg()) {
            exe = new detailUtil(ui);
        } else {
            exe = new indexUtil(ui);
        }
    
        if(exe !== null) exe.exec();
    }
    if(new RegExp(/\/diagnose\/indexv2\/index\/projID\/[0-9]+/).test(cr_url))
        open_repo();
    else if(new RegExp(/\/diagnose\/indexv2\/report\/projID\/[0-9]+/).test(cr_url))
        act_repo();
};

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
        case "table-ng2na":
            allSvUtil.table_NG2NA();
            break;
        case "table-ng2tk":
            allSvUtil.table_NG2TK();
            break;
        case "run-js":
            instantJS();
            break;
        case "sv-extended":
            llb_sv_ui_tool();
            break;
        case "repo-util":
            llb_repo_util();
            break;
        default:
            break;
    }

});
