class Count extends React.Component{
    constructor(){
        this.state={count:0};
    }
    update(){
        this.setState({
            count:++this.state.count
        });
    }
    render(){
        return (
            <div>
                <h1>Count</h1>
                <h3>{this.state.count}</h3>
            </div>

        );
    }
}
class Comment extends React.Component{
    render(){
        return(
            <div>
                <div className="comment-body">
                    {this.props.children}
                </div>
                <div className="comment-author">
                    {this.props.author}
                </div>
            </div>


        )
    }
}
class CommentForm extends React.Component{
    handleSubmit(e){
        e.preventDefault();
        const author = this.refs.author.getDOMNode().value.trim();
        const body = this.refs.body.getDOMNode().value.trim();
        const form = this.refs.form.getDOMNode();

        this.props.onSubmit({author:author,body:body})

        form.reset();
    }
    render(){
        return(
            <form className="comment-form" ref="form" onSubmit={e=>{this.handleSubmit(e)}}>
                <input type="text" placeholder='your name' ref="author"/>
                <input type="text" placeholder='your name' ref="body"/>
                <input type="submit" value="Add Comment"/>
            </form>
        )
    }
}

class CommentList extends React.Component{
    render(){
        var commentsNode=this.props.comments.map(function (comment,index) {
            return <Comment key={'comment-'+index} author={comment.author}>{comment.body}</Comment>
        });
        return(
            <div className="comment-list">
                {commentsNode}
            </div>
        )
    }
}
//var comments=[
//    {author:"ling3",body:"This is mt comment3."}
//];
//var other=[
//    {author:"ling1",body:"This is mt comment."},
//    {author:"ling2",body:"This is mt comment2."},
//    {author:"ling3",body:"This is mt comment3."}
//]
class CommentBox extends React.Component{
    constructor(props){//构造函数
        super();//调用父的函数
        this.state={
            comments:props.comments || []
        }
    }
    loadDataFromServer(){
        $.ajax({
            url:this.props.url,
            dataType:"json",
            success:comments => {//只有一个参数省略括号
                //console.log(this);
                this.setState({comments:comments})
            },
            error:(xhr,status,err) => {
               console.log(err.toString())
            }
        });
    }
    componentDidMount(){
        this.loadDataFromServer();
    }
    handleNewComment(comment){
        const comments=this.state.comments;
        const newComments=comments.concat([comment]);
        this.setState({comments:newComments});
        setTimeout(() =>{
            $.ajax({
                url:this.props.url,
                dataType:"json",
                type:"POST",
                data:comment,
                success:comments => {
                    this.setState({comments:comments});
                },
                error:(xhr,status,err) => {
                    console.log(err.toString());
                    this.setState({comments:comments})
                }
            })
        },2000)

    }
    render(){
        return (
            <div className="comment-box">
                <h1>Comments</h1>
                <CommentList comments={this.state.comments}/>
                <CommentForm onSubmit={comment => { this.handleNewComment(comment)}}/>
            </div>
        );
    }
}

var box=React.render(
    <CommentBox url="comments.json"/>,
    document.getElementById("content")
);