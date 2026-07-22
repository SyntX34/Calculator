<?php
?>
<header class="header">
    <div class="header-container">
        <div class="logo">
            <a href="index.php">
                <img id="headerLogo" src="images/logo.svg" alt="CalcHub Logo" class="logo-img">
                <span>Calculator Hub</span>
            </a>
        </div>
        
        <nav class="header-nav">
            <a href="index.php?page=calculator" class="<?php echo $page === 'calculator' ? 'active' : ''; ?>">
                <i class="fas fa-calculator"></i> Calculator
            </a>
            <a href="index.php?page=about" class="<?php echo $page === 'about' ? 'active' : ''; ?>">
                <i class="fas fa-info-circle"></i> About
            </a>
            <a href="index.php?page=contact" class="<?php echo $page === 'contact' ? 'active' : ''; ?>">
                <i class="fas fa-envelope"></i> Contact
            </a>
        </nav>
        
        <div class="header-controls">
            <button id="themeToggle" class="theme-toggle" title="Toggle Theme">
                <i class="fas fa-moon"></i>
            </button>
            <button id="navToggle" class="sidebar-toggle" title="Toggle Navigation" aria-label="Toggle navigation menu">
                <i class="fas fa-ellipsis-v"></i>
            </button>
            <button id="sidebarToggle" class="sidebar-toggle" title="Toggle Modes" aria-label="Toggle calculator modes sidebar">
                <i class="fas fa-bars"></i>
            </button>
        </div>
    </div>
</header>