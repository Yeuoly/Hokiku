import E from 'wangeditor';
import { api_resource_upload_any } from '../../../interface/api';
const { $, PanelMenu, Panel } = E;

//定义Panel，这里有俩Panel，一个控制字号一个插入latex
const createPanel = (editor, begin, end, failed) => {
    const upload = async file => {
        begin && typeof begin === 'function' && begin();
        try {
            const { data } = await api_resource_upload_any(file)
            if(!data){
                failed && typeof failed === 'function' && failed('网络错误');
            }else{
                if(data['res'] != 0){
                    failed && typeof failed === 'function' && failed(data['err']);
                }else{
                    const filename = file.name;
                    editor.cmd.do('insertHTML', `<a href="${data['data']['extra']}" target="_blank">${filename}</a>`);
                }
            }
        } catch (e) {
            failed && typeof failed === 'function' && failed('网络错误');
        }
        end && typeof end === 'function' && end();
    }
    
    const conf =  {
        width : 300,
        height : 0,
        tabs : [{ 
            title : '上传附件',
            tpl : `<div>
                        <input  
                            type="file" 
                            placeholder="文件"
                            id="upload-attachment"
                        />
                        </td>
                        <div class="w-e-button-container">
                            <button type="button" id="btn-upload-attachment" class="right">
                                上传
                            </button>
                        </div>
                    </div>`,
            events : [
                {
                    selector : '#btn-upload-attachment',
                    type : 'click',
                    fn : () => {
                        //获取输入
                        const files = document.getElementById('upload-attachment').files;
                        if (files.length === 0) {
                            return;
                        }
                        //上传文件
                        const file = files[0];
                        console.log(file);
                        upload(file)
                        return true;
                    }
                }
            ]
        }]
    }
    return conf;
} 

export default class UploadAttachmentMenu extends PanelMenu {
    constructor(editor){
        const $elem = $(
            `<div class="w-e-menu" data-title="上传附件" style="color: grey; font-weight: 500;font-size: 14px;">
                <button>
                    UP
                </button>
            </div>`
        );
        editor.config.onUploadAttachmentBegin = cb => {
            this.uploadAttachmentBegin = cb;
        };
        editor.config.onUploadAttachmentEnd = cb => {
            this.uploadAttachmentEnd = cb;
        };
        editor.config.onUploadAttachmentFailed = cb => {
            this.uploadAttachmentFailed = cb;
        };
        super($elem, editor);
    }

    clickHandler(){
        this.createPanel();
    }

    createPanel(){
        //如果是激活状态则打开改字号的panel，否则插入latex
        const conf = createPanel(this.editor, this.uploadAttachmentBegin, this.uploadAttachmentEnd, this.uploadAttachmentFailed);
        const panel = new Panel(this, conf);
        panel.create();
    }
}