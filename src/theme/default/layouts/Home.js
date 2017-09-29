import React from 'react'
import Header from '../includes/Header'
import Sidebar from '../includes/Sidebar'
import Footer from '../includes/Footer'
import _ from 'lodash'
import moment from 'moment';
import '../css/main.min.css'
import '../css/style.css'
import 'font-awesome/css/font-awesome.min.css'

const HomeContentWithLatestPost = (props) => (
<div>
  {props.data ? props.data.map((item) => {
    return 	<div key={item.id} className="new">
        <div className="col-md-6 new-text wow fadeIn animated">
          {props.theTitle(item.id, item.title)}
          <small>{moment(item.createdAt).format("MMMM Do YY, h:mm:ss a")}</small>
          <section className="content-body">
            {props.theExcerpt(item.content)}
          </section>
        </div>
        <div className="col-md-6 welcome-img">
          {props.theImage(item.imageFeatured)}
        </div>
        <div className="clearfix"> </div>
      </div>
    })
      :
      <div style={{height: 760, width: "100%", clear: 'both'}}>&nbsp;</div>
  }
  {props.thePagination}
</div>
)


const HomeContentWithPage = (props) => (
<div>
  {props.data &&
  <div className="blog_box">
    <div className="blog_grid">
      { props.data.imageFeatured &&
      <a href="single.html">
        <img src={props.data.imageFeatured.blobUrl} className="img-responsive" alt=""/>
      </a>
      }

      <div className="single_desc">
        <div dangerouslySetInnerHTML={{__html: props.data.content}} />
      </div>
    </div>
  </div>
  }
</div>             
)


const Home = React.createClass({
  onContactLinkClick: function(e){
    if (e.target && e.target.nodeName === 'A' && e.target.className === 'button'){
      e.preventDefault()
      this._reactInternalInstance._context.history.push('/page/UG9zdDozNzQ=')
    }
  },

  componentDidMount: function(){
    document.body.addEventListener('click', this.onContactLinkClick)
  
  },
	render: function() {
		return (
			<div id="page-wrapper" className="application">
				<Header {...this.props} />	   
						     {
                   this.props.theConfig.frontPage === 'latestPost' ? 
                     <HomeContentWithLatestPost {...this.props}/>
                     :
                     <HomeContentWithPage {...this.props}/>
						     }
				<Footer {...this.props} />	
			</div>
		)
	}
});

export default Home;
