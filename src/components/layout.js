/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import { makeStyles } from '@material-ui/core/styles';
import Header from "./header"
import "./layout.css"

const useStyles = makeStyles(theme => ({
    appBar: {
        top: 'auto',
        bottom: 0,
        left: 0,
        position: "fixed",
        width: "100%",
        backgroundColor: "rebeccapurple",
        textAlign: "center",
        color: "white",
        '& a': {
            color: "cyan",
            textDecoration: "none"
        },
        '& ul': {
            paddingTop: '5px',
            paddingBottom: '5px',
            margin: '0'
        },
        '& li': {
            borderRight: '1px solid #ffffff',
            display: 'inline',
            paddingLeft: '5px',
            paddingRight: '5px'
        },
        '& li:last-child': {
            borderRight: 'none'
        }
    },
    root: {
        flexGrow: 1
    },
}));

const ExternalLink = ({url, children}) => (
    <a href={url} rel="noopener noreferrer" target="_blank">{children}</a>
)
const Layout = ({ children }) => {
    const classes = useStyles();

    const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <Header siteTitle={data.site.siteMetadata.title} />
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 1280,
          minWidth: 960,
          padding: `0 1.0875rem 1.45rem`,
        }}
      >
        <main>{children}</main>
        <footer className={classes.appBar}>
            <ul>
                <li>© {new Date().getFullYear()} <ExternalLink url="https://www.twitter.com/lokkju">lokkju</ExternalLink></li>
                <li>Data from <ExternalLink url="https://covidtracking.com/api/">The COVID Tracking Project</ExternalLink></li>
                <li>Hosted by <ExternalLink url="https://github.com/knowndata-covid19">Github</ExternalLink></li>
                <li>Built with <ExternalLink url="https://www.gatsbyjs.org">Gatsby</ExternalLink></li>
            </ul>
        </footer>
      </div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
