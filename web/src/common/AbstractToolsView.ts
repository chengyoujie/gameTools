module tools {
    /**
     * 
     * AbstractToolsView类
     * made by cyj
     * create on 2021-02-18 15:22:37 
    */
    export abstract class AbstractToolsView extends Component{

        constructor(opt?: ShowOptions)
        {
            super(opt);
        }
        public abstract onProjectChange(projectInfo:ProjectConfig):void;

        public onDragFile?(files:string[]):any;

    }
}