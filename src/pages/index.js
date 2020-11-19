import React from "react"
import { Link, graphql } from "gatsby"
import Img from 'gatsby-image'

import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allMarkdownRemark.edges

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="All posts" />
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
      {posts.map(({ node }, index) => {
        const title = node.frontmatter.title || node.fields.slug
        
        switch (index % 6) {
          case 1:
          case 2:
          case 3:
            return (
              <article key={node.fields.slug} className="post col-md-4 col-xs-12">
                <Img
                  fluid={node.frontmatter.cover.childImageSharp.fluid}
                  imgStyle={{ objectFit: 'contain' }}
                />
                <header>
                  <div>
                  <small>
                  {
                    node.frontmatter.hashtag?
                    node.frontmatter.hashtag.split(',').map((item) => {
                      return <Link style={{ color: 'deepOrange', margin: 2 }}>{item}</Link>
                    }): ''
                  }
                  </small>
                  </div>
                  <h3
                    style={{
                      marginTop: 0,
                      marginBottom: rhythm(1 / 4),
                    }}
                  >
                    <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
                      {title}
                    </Link>
                  </h3>
                  <small>{node.frontmatter.date}</small>
                </header>
                <section>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: node.excerpt,
                    }}
                  />
                </section>
              </article>
            )

          case 4:
          case 5:
            return (
              <article key={node.fields.slug} className="post col-md-6 col-xs-12">
                <Img fluid={node.frontmatter.cover.childImageSharp.fluid} />
                <header>
                  <div>
                  <small>
                  {
                    node.frontmatter.hashtag?
                    node.frontmatter.hashtag.split(',').map((item) => {
                      return <Link style={{ color: 'deepOrange', margin: 2 }}>{item}</Link>
                    }): ''
                  }
                  </small>
                  </div>
                  <h3
                    style={{
                      marginTop: 0,
                      marginBottom: rhythm(1 / 4),
                    }}
                  >
                    <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
                      {title}
                    </Link>
                  </h3>
                  <small>{node.frontmatter.date}</small>
                </header>
                <section>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: node.excerpt,
                    }}
                  />
                </section>
              </article>
            )

          default:
            return (
              <article key={node.fields.slug} style={{ padding: 4 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  <div className="col-md-7 col-xs-12">
                    <Img fluid={node.frontmatter.cover.childImageSharp.fluid} />
                  </div>
                  <div className="col-md-5 col-xs-12" style={{ padding: 8 }}>
                  <header>
                    <div>
                    <small>
                    {
                      node.frontmatter.hashtag?
                      node.frontmatter.hashtag.split(',').map((item) => {
                        return <Link style={{ color: 'deepOrange', margin: 2 }}>{item}</Link>
                      }): ''
                    }
                    </small>
                    </div>
                    <h3
                      style={{
                        marginTop: 0,
                        marginBottom: rhythm(1 / 4),
                      }}
                    >
                      <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
                        {title}
                      </Link>
                    </h3>
                    <small>{node.frontmatter.date}</small>
                  </header>
                  <section>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: node.excerpt,
                      }}
                    />
                  </section>
                  </div>
                </div>
              </article>
            )
        }
      })}      
      </div>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            hashtag
            cover {
              childImageSharp {
                fluid(maxWidth: 800) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }
`
