---
# layout: home
layout: default
---

{%- for collection in site.collections -%}
		{%- assign numdocs = collection.docs | size -%}
			{%- if numdocs > 0 -%}
			<h2>
				{%- if collection.title -%}
					{{- collection.title -}}
				{%- else -%}
					{{- collection.label -}}
				{%- endif -%}
			</h2>
			{%- for doc in collection.docs -%}
				<p><a href="{{- doc.url | relative_url -}}">{{ doc.title }}</a></p>
			{%- endfor -%}
		{%- endif -%}
{%- endfor -%}
