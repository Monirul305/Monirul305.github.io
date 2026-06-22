---
layout: page
title: publications
permalink: /publications/
description: >
  Peer-reviewed publications, manuscripts under review, and work in preparation.
  My name is shown in <strong>bold</strong> in author lists.
nav: true
nav_order: 2
---

<p>
  <strong>Author position is shown in each entry.</strong>
  Below: <strong>2</strong> peer-reviewed (1 co-authored MDPI journal, 1 co-authored IEEE conference) ·
  <strong>2</strong> first-author manuscripts (1 under review, 1 in preparation) ·
  <strong>1</strong> co-authored manuscript under review.
</p>

## Peer-reviewed

{% bibliography --query @*[status=Published] %}

## Under review

{% bibliography --query @*[status=Submitted] %}

## In preparation

{% bibliography --query @*[status=InPrep] %}
