import React from "react";
import {join} from "path";
import {
	Link,
	getCurrentRequestContext,
	RequestLocalStorage,
} from "react-server";

import SvgDropdown from './assets/SvgDropdown';

import './doc-contents.less'

const RLS = RequestLocalStorage.getNamespace();

const ContentsSection = ({name, pages}) => (
	<div className='contentsSection'>
		<h3>{name}</h3>
		<ul>{pages.map(ContentsLink)}</ul>
	</div>
)

const currentPath = () => getCurrentRequestContext().getCurrentPath();

const classIfActive = path => (path === currentPath())?{className:"active"}:{}

const ContentsLink = ({name, path}) => ContentsLinkWithMungedPath(
	name, join("/docs", path)
)

const ContentsLinkWithMungedPath = (name, path) => <li {...classIfActive(path)}>
	<Link reuseDom path={path}>{name}</Link>
</li>

export default class DocContents extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			menuOpen: false,
		};
	}

	static setResponse(res) {
		const path = getCurrentRequestContext().getCurrentPath().replace("/docs/", "");

		// This is all we care about stashing away.  We'll _also_ receive the
		// response as a prop on our instance, later.  We just need the active
		// page _before_ our element is created (for the page title, etc)
		RLS().activePageName = (res.contents.reduce((page, section) => (
			page || section.pages.find(page => page.path === path)
		), null) || {name: "React Server Documentation"}).name;

		// Pass it along.
		return res;
	}

	static activePageName() {
		return RLS().activePageName;
	}

	componentDidMount() {
		getCurrentRequestContext().navigator.on( "navigateStart", this.closeMenu.bind(this) );
	}

	render() {
		return <div className={'DocContents ' + (this.state.menuOpen ? 'menuOpen' : '')}>
			<h2 className='contentsActivePage' onClick={this.toggleMenuOpen.bind(this)}>
				{DocContents.activePageName()} <SvgDropdown />
			</h2>
			<div className="contentsSections">{
				this.props.contents.map(ContentsSection)
			}</div>
		</div>
	}

	toggleMenuOpen() {
		console.log("MENUOPEN: ",this.state.menuOpen);
		this.setState( {menuOpen: !this.state.menuOpen} );
	}

	closeMenu() {
		this.setState( {menuOpen: false} );
	}
}
