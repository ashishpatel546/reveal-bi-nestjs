module.exports = [
  {
    script: './dist/main.js',
    name: 'etl-bi',
    exec_mode: 'cluster',
    instances: 1,
    autorestart: true,
    out_file: '/logs/etl_bi.log',
    error_file: '/logs/etl-bi.log',
    "node_args": [
      "--max_old_space_size=8000"
    ]
    // max_memory_restart: "800M"
  },
];



