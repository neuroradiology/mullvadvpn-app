use clap::{App, Arg};
use log;

use std::path::PathBuf;

pub struct Config {
    pub log_level: log::LogLevelFilter,
    pub log_file: Option<PathBuf>,
    pub tunnel_log_file: Option<PathBuf>,
}

pub fn get_config() -> Config {
    let app = create_app();
    let matches = app.get_matches();

    let log_level = match matches.occurrences_of("v") {
        0 => log::LogLevelFilter::Info,
        1 => log::LogLevelFilter::Debug,
        _ => log::LogLevelFilter::Trace,
    };
    let log_file = matches.value_of_os("log_file").map(PathBuf::from);
    let tunnel_log_file = matches.value_of_os("tunnel_log_file").map(PathBuf::from);

    Config {
        log_level,
        log_file,
        tunnel_log_file,
    }
}

fn create_app() -> App<'static, 'static> {
    App::new(crate_name!())
        .version(crate_version!())
        .author(crate_authors!())
        .about(crate_description!())
        .arg(
            Arg::with_name("v")
                .short("v")
                .multiple(true)
                .help("Sets the level of verbosity."),
        )
        .arg(
            Arg::with_name("log_file")
                .long("log")
                .takes_value(true)
                .help("Activates file logging to the given path"),
        )
        .arg(
            Arg::with_name("tunnel_log_file")
                .long("tunnel-log")
                .takes_value(true)
                .help("Save log from tunnel implementation process to this file path"),
        )
}
