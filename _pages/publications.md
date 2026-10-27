---
layout: page
title: publications
permalink: /publications/
description: >
  Peer-reviewed publications, manuscripts submitted, and work in preparation.
  My name is shown in <strong>bold</strong> in author lists.
nav: true
nav_order: 2
---

<p>
  <strong>Author position is shown in each entry.</strong>
  Below: <strong>2</strong> peer-reviewed (1 co-authored MDPI journal, 1 co-authored IEEE conference) ·
  <strong>2</strong> first-author manuscripts (1 submitted, 1 in preparation) ·
  <strong>1</strong> co-authored manuscript submitted ·
  <strong>1</strong> U.S. provisional patent application (co-inventor).
</p>

## Peer-reviewed

{% bibliography --query @*[status=Published] %}

## Submitted

{% bibliography --query @*[status=Submitted] %}

## In preparation

{% bibliography --query @*[status=InPrep] %}

## Patents

- Oscar Burl Smith IV, **Md Monirul Islam**, Tajwar Al Mamun, *System and Method for Monitoring Waste Container Location and Status*, U.S. provisional patent application No. 64/151,180, filed 9 September 2026.
