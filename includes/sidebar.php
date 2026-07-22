<?php
?>
<aside class="sidebar" id="sidebar">
    <div class="sidebar-header">
        <h3><i class="fas fa-th-large"></i> Modes</h3>
        <button class="sidebar-close" id="sidebarClose">
            <i class="fas fa-times"></i>
        </button>
    </div>
    
    <nav class="sidebar-nav">
        <a href="#" class="mode-link active" data-mode="normal">
            <i class="fas fa-calculator"></i> Normal
        </a>
        <a href="#" class="mode-link" data-mode="scientific">
            <i class="fas fa-square-root-variable"></i> Scientific
        </a>
        <a href="#" class="mode-link" data-mode="weather">
            <i class="fas fa-cloud-sun"></i> Weather
        </a>
        <a href="#" class="mode-link" data-mode="currency">
            <i class="fas fa-dollar-sign"></i> Currency
        </a>
        <a href="#" class="mode-link" data-mode="age">
            <i class="fas fa-calendar-alt"></i> Age
        </a>
        <a href="#" class="mode-link" data-mode="percentage">
            <i class="fas fa-percent"></i> Percentage
        </a>
        <a href="#" class="mode-link" data-mode="unit">
            <i class="fas fa-ruler"></i> Unit Converter
        </a>
        <a href="#" class="mode-link" data-mode="programming">
            <i class="fas fa-code"></i> Programming
        </a>
        <a href="#" class="mode-link" data-mode="date">
            <i class="fas fa-clock"></i> Date
        </a>
        <a href="#" class="mode-link" data-mode="statistics">
            <i class="fas fa-chart-bar"></i> Statistics
        </a>
        <a href="#" class="mode-link" data-mode="color">
            <i class="fas fa-palette"></i> Color Codes
        </a>
        <a href="#" class="mode-link" data-mode="distance">
            <i class="fas fa-route"></i> Distance & Speed
        </a>
    </nav>

    <nav class="sidebar-page-links">
        <a href="index.php?page=calculator" class="sidebar-calc-link">
            <i class="fas fa-calculator"></i> Calculator
        </a>
        <a href="index.php?page=about">
            <i class="fas fa-info-circle"></i> About
        </a>
        <a href="index.php?page=contact">
            <i class="fas fa-envelope"></i> Contact
        </a>
    </nav>
    
    <div class="sidebar-icon-picker">
        <div class="sidebar-icon-picker-header">
            <i class="fas fa-paint-brush"></i> App Icon
        </div>
        <div class="icon-options">
            <img src="images/logo.svg" class="icon-option active" data-icon="logo.svg" alt="Default" title="Default">
            <img src="images/logo1.jpg" class="icon-option" data-icon="logo1.jpg" alt="Icon 1" title="Icon 1">
            <img src="images/logo2.jpg" class="icon-option" data-icon="logo2.jpg" alt="Icon 2" title="Icon 2">
            <img src="images/logo3.jpg" class="icon-option" data-icon="logo3.jpg" alt="Icon 3" title="Icon 3">
        </div>
    </div>
</aside>